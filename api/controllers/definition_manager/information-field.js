/**
 * definition_manager/information-field.js
 *
 *
 * url:     get / /definition/info/object/:objID/field/:ID
 * header:  X-CSRF-Token : [token]
 * params:
 */

var inputParams = {
   objID: { string: { uuid: true }, required: true },
   ID: { string: { uuid: true }, required: true },
};

// make sure our BasePath is created:
module.exports = function (req, res) {
   req.ab.log(`definition_manager::information-field`);

   // verify your inputs are correct:
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
   let jobData = {
      objID: req.ab.param("objID"),
      ID: req.ab.param("ID"),
   };

   // pass the request off to the uService:
   req.ab.serviceRequest(
      "definition_manager.information-field",
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
