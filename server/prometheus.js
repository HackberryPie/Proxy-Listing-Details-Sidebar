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
  buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500]
});

prometheusExporter.staticFileRequestDurationMicroseconds = new prometheus.Histogram(
  {
    name: 'static_file_request_duration_ms',
    help: 'Duration of Static File requests in ms',
    labelNames: ['method', 'route', 'code'],
    buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500]
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
