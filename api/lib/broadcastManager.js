/**
 * @broadcastManager
 * This is where we manage how and to who we are broadcasting our realtime updates.
 *
 * In this iteration of our RT Updates, users will only get updates on data THEY
 * have requested / created.
 *
 * Users should only get 1 update for a particular change, not multiple.
 *
 * How Broadcast Update work now:
 *
 * when a user performs a model_get request, our api_sails controller will register
 * the user's current request object with us: BroadcastManager.register(req);
 *
 * when the appbuilder.model_get handler is ready to respond, it will first
 * perform a .serviceRequest("api_sais.broadcastRegister", [IDs]) with an array
 * of all the IDs of the rows being returned.
 *
 * Our handler will then register the user's req with a {tenantID}-{ID} socket
 * room.
 *
 * the appbuilder.model_get handler will return it's data, and before our
 * api_sails.model_get controller resolves, it will then BroadcastManager.unregister(req)
 * the current connection.
 *
 * When future Broadcasts are sent out, they will be sent to {tenantID}-{ID} rooms
 * and those connected sockets will get the updates.
 */
const CurrentUserRequests = {
   /* username : { sails.req } */
};
// Keep track of the currently active req objects that are awaiting a broadcast-register

var broadcastRequiredFields = ["room", "event", "data"];
// {array[string]}
// a list of required fields each of our broadcast packets need to have.

const AB = require("@digiserve/ab-utils");
const ReqAB = AB.reqApi({}, {}, {});
ReqAB.jobID = "api_broadcast_manager";

/**
 * @event api.broadcast
 * This event is for our Appbuilder Model operations (create, update, delete)
 * to notify our connected clients of changes to data they have loaded.
 */
ReqAB.serviceResponder("api.broadcast", (req, cb) => {
   var data = req.param();
   if (!Array.isArray(data)) {
      data = [data];
   }
   var errors = [];
   data.forEach((d) => {
      var errMsg = false;
      broadcastRequiredFields.forEach((f) => {
         if (!d[f]) {
            if (!errMsg) {
               errMsg = `data packet missing field: ${f}`;
            } else {
               errMsg = `${errMsg}, ${f}`;
            }
         }
      });
      if (errMsg) {
         errors.push({ message: errMsg, packet: data });
         return;
      }
      req.log(`::::: BroadcastManager:  broadcasting: ${d.room} ${d.event}`);
      sails.sockets.broadcast(d.room, d.event, d.data);
   });
   if (errors.length > 0) {
      console.log(JSON.stringify(errors, null, 4));
      cb(errors);
      return;
   }
   cb(null);
});

/**
 * @event api_sails.broadcast-register
 * This event is for our Appbuilder Model operations (get, create)
 * to notify us of specific Data Entries (id) that a connected user
 * is interested in.
 */
ReqAB.serviceResponder("api.broadcast-register", (req, cb) => {
   let IDs = req.param("ID") || [];

   req.log(`::::: BroadcastManager received for IDs[${IDs.length}]`);
   let user = req.user;
   if (req.userReal) {
      user = req.userReal;
   }
   if (!user) {
      req.log("::::: BroadcastManager: Unable to find User entry:", req);
      return cb(null);
   }
   let userReq = CurrentUserRequests[user.username]?.req;
   if (!userReq) {
      req.log(
         `::::: BroadcastManager: could not find userReq entry for provided user[${user.username}]`
      );
      req.log(
         `::::: BroadcastManager: Keys:${Object.keys(CurrentUserRequests)}`
      );
      cb(null);
      return;
   }
   IDs.forEach((id) => {
      const userRoom = userReq.ab.socketKey(id);
      sails.sockets.join(userReq, userRoom);
   });
   cb(null);
});

module.exports = {
   register: function (req) {
      // NOTE: req here is from our sails controllers, so req.ab has our
      // user info:

      // we make sure to use the switcheroo'd user since the actual
      // user might also be using the site, and we don't want to
      // confuse the two different sockets.
      let user = req.ab.user;
      if (req.ab.isSwitcherood()) {
         user = req.ab.userReal;
      }
      // req.ab.log(`1111111 registering user request [${user.username}]`);
      if (!CurrentUserRequests[user.username]) {
         CurrentUserRequests[user.username] = {
            c: 0,
            req,
         };
      }
      CurrentUserRequests[user.username].c++;
      CurrentUserRequests[user.username].req = req;
      // req.ab.log(`1111111 Keys: ${Object.keys(CurrentUserRequests)}`);
   },

   unregister: function (req) {
      // NOTE: req here is from our sails controllers, so req.ab has our
      // user info:

      // we make sure to use the switcheroo'd user since the actual
      // user might also be using the site, and we don't want to
      // confuse the two different sockets.
      let user = req.ab.user;
      if (req.ab.isSwitcherood()) {
         user = req.ab.userReal;
      }
      // req.ab.log("222222222 removing user request ", user, user.username);
      let entry = CurrentUserRequests[user.username];
      if (entry) {
         // req.ab.log("222222222 entry found");
         entry.c--;

         if (entry.c <= 0) {
            // req.ab.log("222222222 entry DELETED");
            delete CurrentUserRequests[user.username];
         }
         // req.ab.log(`222222222 Keys: ${Object.keys(CurrentUserRequests)}`);
      }
   },
};
