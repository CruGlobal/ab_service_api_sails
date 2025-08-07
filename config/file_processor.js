/* 
 * file_processor
 */
var path = require("path");
module.exports.file_processor = {
   enable: false,
   basePath: path.sep + path.join("data"),
   uploadPath: "tmp",
   maxBytes: 10000000,
   maxFiles: 10,
   allowedTypes: [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/bmp",
      "image/webp"
   ],
   
   // File storage strategy
   saveAs: function(file) {
      const uuid = require('uuid').v4();
      const ext = path.extname(file.filename);
      return uuid + ext;
   },
   
   // 响应格式
   responseFormat: function(uploadedFiles) {
      return {
         success: true,
         data: {
            uuids: uploadedFiles.map(file => {
               const filename = path.basename(file.fd);
               return filename.split('.')[0];
            })
         }
      };
   }
};