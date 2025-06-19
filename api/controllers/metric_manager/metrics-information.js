const MetricManager = require("../../lib/metricManager");

/**
 * metric_manager/metrics-information.js
 * @apiDescription Request data loggings in Prometheus format.
 *
 * @api {get} /metrics Metrics
 * @apiSuccess (200) {string} data log in Prometheus format
 */

// make sure our BasePath is created:
module.exports = async function (req, res) {
   req.ab.log("metric_manager::metrics-information");

   const metrics = await MetricManager.getMetrics();

   res.set("Content-Type", MetricManager.contentType);
   return res.send(metrics);
};
