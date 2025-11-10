/**
 * plugin/plugin-add.js
 */

/**
 * @api {POST} /plugin/add Add Plugin
 * @apiPermission User
 * @apiGroup Plugin
 * @apiBody {string} url The plugin URL (must be a valid URI). Required.
 * @apiUse successRes
 */

var inputParams = {
   id: { string: true, optional: true },
   url: { string: true, required: true },
};

module.exports = function (req, res) {
   req.ab.log(`plugin::plugin-add`);

   // verify your inputs are correct:
   // false : prevents an auto error response if detected. (default: true)
   if (
      !(req.ab.validUser(/* false */)) ||
      !(req.ab.validBuilder(/* false */)) ||
      !req.ab.validateParameters(inputParams /*, false , valuesToCheck*/)
   ) {
      // an error message is automatically returned to the client
      // so be sure to return here;
      return;
   }

   // create a new job for the service
   let jobData = {};
   Object.keys(inputParams).forEach((k) => {
      jobData[k] = req.ab.param(k);
   });

   // pass the request off to the uService:
   req.ab.serviceRequest(
      "definition_manager.plugin-add",
      jobData,
      (err, results) => {
         if (err) {
            res.ab.error(err);
            return;
         }
         res.ab.success(results);
      }
   );
};
