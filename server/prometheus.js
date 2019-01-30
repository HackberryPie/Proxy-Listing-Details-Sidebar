const prometheus = require('prom-client');

const prometheusExporter = {};

prometheusExporter.totalRequests = new prometheus.Counter({
  name: 'total_requests',
  help: 'number of times server recieves a request'
});

prometheusExporter.successCount = new prometheus.Counter({
  name: 'status_code_200',
  help: 'number of successes in retrieving and sending data'
});

prometheusExporter.failureCount = new prometheus.Counter({
  name: 'status_code_500',
  help: 'number of failures in retrieving and sending data'
});

prometheusExporter.apiRequestDurationMicroseconds = new prometheus.Histogram({
  name: 'api_request_duration_ms',
  help: 'Duration of API requests in ms',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.0001, 0.001, 0.0025, 0.005, 0.01, 0.02, 0.03, 0.05, 1]
});

prometheusExporter.staticFileRequestDurationMicroseconds = new prometheus.Histogram(
  {
    name: 'static_file_request_duration_ms',
    help: 'Duration of Static File requests in ms',
    labelNames: ['method', 'route', 'code'],
    buckets: [
      0.000001,
      0.000005,
      0.000015,
      0.000025,
      0.00005,
      0.0001,
      0.00025,
      0.0005,
      0.001
    ]
  }
);

prometheusExporter.histogramLabels = (histogram, req, res) => {
  return histogram.labels(req.method, res.route, res.statusCode);
};

prometheusExporter.serveMetrics = (req, res) => {
  res.writeHead(200, { 'Content-Type': prometheus.register.contentType });
  return res.end(prometheus.register.metrics());
};

module.exports = prometheusExporter;
