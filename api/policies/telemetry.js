module.exports = async (req, res, next) => {
   if (!sails.config.custom.sentry) return next();
   const path = req.route.path;
   req.ab.spanRequest(path, {
      op: req.protocol == "ws" ? "websocket.server" : "http.server",
   });
   // Queue the end of the tracing span
   res.once("finish", () => {
      setImmediate(() => req.ab.spanEnd(path));
   });
   next();
};
