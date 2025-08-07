/**
 * file_processor/image-upload.js
 *
 *
 * url:     post /image/upload/:isWebix
 * header:  X-CSRF-Token : [token]
 * params:
 */

const async = require("async");
const path = require("path");
const shell = require("shelljs");

// setup our base path:
var pathFiles = sails.config.file_processor
   ? sails.config.file_processor.basePath
   : false || path.sep + path.join("data");

// expect that our location for storing files will be:
// /data/[tenant.ID]/file_processor
// /data/tmp  <<-- incoming file directory

// create that path if it doesn't already exist:
shell.mkdir("-p", pathFiles);

var inputParams = {
   isWebix: { string: true, optional: true },
   image_fullpath: { string: true, optional: true },
};

// make sure our BasePath is created:
module.exports = function (req, res) {
   // Package the Find Request and pass it off to the service

   req.ab.log(`file_processor::image-upload`);

   // verify your inputs are correct:
   if (
      !(req.ab.validUser(/* false */)) ||
      !req.ab.validateParameters(inputParams /*, false , valuesToCheck*/)
   ) {
      // an error message is automatically returned to the client
      // so be sure to return here;
      return;
   }

   const isWebix = req.ab.param("isWebix") || "??";

   var fileEntries = []; // 修改：存储所有上传的文件信息
   var serviceResponses = []; // 修改：存储所有服务的响应

   async.series(
      [
         // 1) finish downloading the files
         (next) => {
            // store the files in our TEMP path
            var dirname = path.join(
               pathFiles,
               sails.config.file_processor.uploadPath || "tmp"
            );
            var maxBytes = sails.config.file_processor.maxBytes || 10000000;
            var maxFiles = sails.config.file_processor.maxFiles || 10; // 添加最大文件数限制
            
            req.file("image").upload(
               { dirname, maxBytes, maxFiles }, // 添加 maxFiles 参数
               function (err, list) {
                  if (err) {
                     req.ab.notify.developer(err, {
                        context:
                           "api_sails:file_processor:image-upload()",
                        isWebix,
                        dirname,
                        maxBytes,
                        maxFiles,
                     });
                     err.code = 500;
                     next(err);
                  } else {
                     fileEntries = list; // 保存所有文件信息
                     req.ab.log("... fileEntries count:", fileEntries.length);

                     if (fileEntries.length > 0) {
                        next();
                     } else {
                        var err2 = new Error(
                           "No files uploaded for parameter [file]"
                        );
                        err2.code = 422;
                        next(err2);
                     }
                  }
               }
            );
         },

         // 2) 处理所有文件
         (next) => {
            // Process all files in parallel
            async.mapLimit(fileEntries, 5, (fileEntry, callback) => {
               var jobData = {
                  name: fileEntry.fd.split(path.sep).pop(),
                  size: fileEntry.size,
                  type: fileEntry.type,
                  fileName: fileEntry.filename,
                  uploadedBy: req.ab.userDefaults().username,
                  convertToExtensions: ["webp"],
               };

               // 将请求传递给服务
               req.ab.serviceRequest(
                  "file_processor.image-upload",
                  jobData,
                  (err, results) => {
                     if (err) {
                        callback(err);
                     } else {
                        callback(null, results);
                     }
                  }
               );
            }, (err, results) => {
               if (err) {
                  next(err);
               } else {
                  serviceResponses = results;
                  next();
               }
            });
         },

         // 3) 打包响应给客户端
         (next) => {
            // 提取所有UUID
            const uuids = serviceResponses.map(response => response.uuid);
            
            // 创建响应数据
            const data = {
               uuids: uuids,
               count: uuids.length
            };

            // 如果是Webix上传器
            if (
               isWebix != "??" &&
               isWebix != "false" &&
               isWebix != false &&
               isWebix != 0
            ) {
               // Webix期望每个文件都有状态
               res.ab.success({
                  status: "server",
                  data: data
               });
            } else {
               res.ab.success(data);
            }
            next();
         },
      ],
      (err /*, results */) => {
         // 处理错误报告回客户端
         if (err) {
            req.ab.log("api_sails:file_processor:image-upload: error", err);
            res.ab.error(err);
         }
      }
   );
};