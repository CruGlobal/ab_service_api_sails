/**
 * Local environment settings
 *
 * Use this file to specify configuration settings for use while developing
 * the app on your personal system.
 *
 * For more information, check out:
 * https://sailsjs.com/docs/concepts/configuration/the-local-js-file
 */
var path = require("path");

const AB = require("@digiserve/ab-utils");
const env = AB.defaults.env;

module.exports = {
   // Any configuration settings may be overridden below, whether it's built-in Sails
   // options or custom configuration specifically for your app (e.g. Stripe, Mailgun, etc.)

   /**
    * datastores:
    * Sails style DB connection settings
    */
   // datastores: AB.defaults.datastores(),
   /* end datastores */

   /**
    * CAS authentication
    */
   cas: {
      enabled: env("CAS_ENABLED", false),
      baseURL: env("CAS_BASE_URL"),
      uuidKey: env("CAS_UUID_KEY"),
      siteURL: env("SITE_URL"),
   },

   /**
    * Okta authentication
    */
   okta: {
      enabled: env("OKTA_ENABLED", false),
      domain: env("OKTA_DOMAIN"),
      clientID: env("OKTA_CLIENT_ID"),
      clientSecret: env("OKTA_CLIENT_SECRET"),
      siteURL: env("SITE_URL"),
   },

   /**
    * File Processor
    * The shared file settings between api_sails and file_Processor services.
    */
   file_processor: {
      enable: env("FILE_PROCESSOR_ENABLE", true),
      basePath: env("FILE_PROCESSOR_PATH", path.sep + path.join("data")),
      uploadPath: env("FILE_PROCESSOR_UPLOAD_DIR", "tmp"),
      maxBytes: env("FILE_PROCESSOR_MAXBYTES", 10000000),
   },

   relay: {
      // Note that "enable" is in present tense.
      enable: env("RELAY_ENABLE", true),

      /*************************************************************************/
      /* Mobile Comm Center (mcc)                                              */
      /* The ab_service_relay sends http requests to ab_api_sails              */
      /* and it uses the accessToken as part of its authentication.            */
      /* See also: ab_service_relay > ./config/local.js                        */
      /*************************************************************************/
      mcc: {
         /**********************************************************************/
         /* enable: {bool} is communicating with our MCC enabled?              */
         /**********************************************************************/
         // Note that "enabled" is in past tense.
         // But "RELAY_ENABLE" is in present tense.
         enabled: env("RELAY_ENABLE", true),

         /**********************************************************************/
         /* accessToken: {string} required accessToken for sails to accept     */
         /**********************************************************************/
         accessToken: env("RELAY_SERVER_TOKEN", "There is no spoon."),
      },
   },

   http: {
      trustProxy: true,
   },

   //  /**
   //   * bot_manager:
   //   * define the connections between our bot_manager and the host command
   //   * processor.
   //   */
   //  bot_manager: {
   //   "dockerHub": {
   //     "enable": false,
   //     "port": 14000
   //   },
   //   "slackBot": {
   //     "enable": false
   //   },
   //   "hostConnection": {
   //     "tcp": {
   //       "port": 1338,
   //       "accessToken": "wf9qMluwBi_Rtlf1mKxOg"
   //     }
   //   },
   //   "stackName": "ab",
   //   "triggers": [
   //     { search: /skipdaddy\/.*:develop/, command: "update", options: {} }
   //   ]
   // },
   // /* end bot_manager */

   //  /**
   //   * log_manager
   //   * service for managing our various logs
   //   */
   //  log_manager: {
   //     enable: true,
   //  },
   //  /* end log_manager */

   //  /**
   //   * notification_email
   //   * our smtp email service
   //   */
   //  notification_email: {
   //     "enable": true,
   //     "default": "smtp",
   //     "smtp": {
   //        "host": "~appdevdesigns.net~",
   //        "port": "465",
   //        "secure": true,
   //        "auth": {
   //           "type": "login",
   //           "user": "noreply@appdevdesigns.net",
   //           "pass": "~6AT%t^2!9vDaa{~"
   //        }
   //     }
   //  },
   // /* end notification_email */

   //  /**
   //   * process_manager
   //   * manages processes
   //   */
   //  process_manager: {
   //     enable: true,
   //  },
   //  /* end process_manager */

   //  /**
   //   * tenant_manager
   //   * manages the different tenants in our system
   //   */
   //  tenant_manager: {
   //     enable: true,
   //     // {bool} enable the tenant_manager service.
   //     // don't turn this off.  You wont like it if you turn it off.

   //     siteTenantID: "admin",
   //     // {string} the uuid of what is considered the "Admin" Tenant.
   //     // this resolves to the Tenant Manager Site, and is established on
   //     // install.  It can be reconfigured ... but only if you know what
   //     // you are doing.
   //     // You have been warned ...
   //  },
   //  /* end tenant_manager */

   //  /**
   //   * user_manager
   //   * manage the users withing a tenant
   //   */
   //  user_manager: {
   //     enable: true,
   //  },
   //  /* end user_manager */
};
