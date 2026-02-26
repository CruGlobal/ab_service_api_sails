const Cache = require("../../lib/cacheManager");
const commonRequest = {};
// {lookupHash} /* user.uuid : Promise.resolves(User) */
// A shared lookup hash to reuse the same user lookup when multiple attempts
// are being attempted in parallel.

module.exports = {
   description: "Get the user from the cache or the user manager service",

   inputs: {
      req: {
         type: "ref",
         required: true,
      },
      tenantID: {
         type: "string",
         required: true,
      },
      userID: {
         type: "string",
         required: true,
      },
   },

   fn: async function ({ req, tenantID, userID }, exits) {
      let cachedUser = Cache.AuthUser(tenantID, userID);
      if (!cachedUser) {
         const key = `${tenantID}-${userID}`;
         // make sure we have a Promise that will resolve to
         // the user created for this userID
         if (!commonRequest[key]) {
            commonRequest[key] = req.ab.serviceRequest(
               "user_manager.user-find",
               {
                  uuid: userID,
               },
            );

            commonRequest[key].__count = 0;
         }

         // now use this Promise and retrieve the user
         commonRequest[key].__count++;
         try {
            const user = await commonRequest[key];
            Cache.AuthUser(tenantID, userID, user);
            cachedUser = user;

            if (commonRequest[key]) {
               req.ab.log(
                  `user.resolve -> lookup shared among ${commonRequest[key].__count} requests.`,
               );
               // we can remove the Promise now
               delete commonRequest[key];
            }
         } catch (err) {
            delete commonRequest[key];
            return exits.error(err);
         }
      } else {
         req.ab.log(`user.resolve -> cached user.`);
      }

      return exits.success(cachedUser);
   },
};
