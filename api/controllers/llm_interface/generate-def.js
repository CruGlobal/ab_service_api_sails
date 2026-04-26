/**
 * llm_interface/generate-def.js
 * @apiDescription Allows an external approval task to report the task
 * as done to continue the process.
 * @api {post} /llminterface/generatedef External Done
 * @apiGroup Process
 * @apiPermission User
 * @apiBody {object} task
 * @apiBody {string} task.id id of the external approval task instance
 * @apiBody {object} [data] any data to add to the process context
 * @apiUse successRes
 */
var inputParams = {
   appID: { string: true, optional: true },
   userMessage: { string: true, optional: true },
   /*    "email": { string:{ email: { allowUnicode: true }}, required:true }   */
   /*                -> NOTE: put .string  before .required                    */
   /*    "param": { required: true } // NOTE: param Joi.any().required();      */
   /*    "param": { optional: true } // NOTE: param Joi.any().optional();      */
};

// make sure our BasePath is created:
module.exports = function (req, res) {
   // Package the Find Request and pass it off to the service

   req.ab.log(`llm_interface::generate-def`);

   // verify your inputs are correct:
   // false : prevents an auto error response if detected. (default: true)
   if (
      !(req.ab.validUser(/* false */)) ||
      !req.ab.validateParameters(inputParams /* , true, validateThis */)
   ) {
      // an error message is automatically returned to the client
      // so be sure to return here;
      return;
   }

   // create a new job for the service
   const appID = req.ab.param("appID");
   const userMessage = req.ab.param("userMessage");

   let jobData = {
      appID,
      userMessage,
   };

   // pass the request off to the uService:
   req.ab.serviceRequest(
      "llm_interface.generate-def",
      jobData,
      { longRequest: true },
      (err, results) => {
         if (err) {
            res.ab.error(err);
            return;
         }
         res.ab.success(results);
      }
   );
};
