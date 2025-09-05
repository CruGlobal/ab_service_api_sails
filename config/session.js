/**
 * Session Configuration
 * (sails.config.session)
 *
 * Use the settings below to configure session integration in your app.
 * (for additional recommended settings, see `config/env/production.js`)
 *
 * For all available options, see:
 * https://sailsjs.com/config/session
 */

module.exports.session = {
   /***************************************************************************
    *                                                                          *
    * Session secret is automatically generated when your new app is created   *
    * Replace at your own risk in production-- you will invalidate the cookies *
    * of your users, forcing them to log in again.                             *
    *                                                                          *
    ***************************************************************************/
   secret:
      process.env.SAILS_SESSION_SECRET || "cf1e0dd462546522d7cebec3f4b841fc",

   /***************************************************************************
    *                                                                          *
    * Customize when built-in session support will be skipped.                 *
    *                                                                          *
    * (Useful for performance tuning; particularly to avoid wasting cycles on  *
    * session management when responding to simple requests for static assets, *
    * like images or stylesheets.)                                             *
    *                                                                          *
    * https://sailsjs.com/config/session                                       *
    *                                                                          *
    ***************************************************************************/
   //// Sails Default
   // isSessionDisabled: function (req){
   //   return !!req.path.match(req._sails.LOOKS_LIKE_ASSET_RX);
   // },

   //// Don't disable sessions for "/plugin/*"
   // isSessionDisabled: function (req) {
   //   // Enable session for all plugin requests.
   //   if (req.path.match(/^\/plugin\//)) {
   //     return false;
   //   }
   //   // Otherwise, disable session for all requests that look like assets.
   //   return !!req.path.match(req._sails.LOOKS_LIKE_ASSET_RX);
   // },

   //// Never disable sessions
   isSessionDisabled: function (/* req */) {
      return false;
   },

   // Use redis in swarm for session store
   adapter: "@sailshq/connect-redis",
   host: process.env.SESSION_REDIS_HOST ?? "redis",
   port: process.env.SESSION_REDIS_PORT ?? 6379,
   db: process.env.SESSION_REDIS_DB ?? 1,
   // timeout: 30000,
};
