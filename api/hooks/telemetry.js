/**
 * hooks/telemetry
 * set up telemetry as soon as sails launches
 */

const { version } = require("../../package");

module.exports = function (sails) {
   return {
      initialize: async function () {
        const { defaults, telemetry } = require("@digiserve/ab-utils");
         // Use sentry be default but allow override by setting the env.TELEMETRY_PROVIDER
         if (defaults.env("TELEMETRY_PROVIDER", "sentry") == "sentry") {
            sails.config.custom.sentry = true; // flag used elsewhere to enable sentry functionality
            telemetry.init("sentry", {
               dsn: defaults.env(
                  "SENTRY_DSN",
                  "https://0363fe8e68b2fbd38a807305a3a1212c@o144358.ingest.sentry.io/4505945407488000"
               ),
               release: version,
            });
         }
      },
   };
};
