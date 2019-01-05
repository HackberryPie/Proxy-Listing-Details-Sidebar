const express = require('express');
const proxy = require('http-proxy-middleware');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/:id", express.static(path.join(__dirname, "./client")));

app.use("/api/details", proxy({ target: "http://ec2-18-218-63-198.us-east-2.compute.amazonaws.com/" }));

app.use("/api/carousel",
    proxy({ target: "http://ec2-18-223-116-251.us-east-2.compute.amazonaws.com/" }));

app.use("/api/similarlistings",
    proxy({ target: "http://ec2-54-174-166-132.compute-1.amazonaws.com/" }));

app.use("/streetBreezy/api/description",
    proxy({ target: "http://ec2-18-218-251-40.us-east-2.compute.amazonaws.com:3009/"}));

app.listen(3000, () => console.log('Proxy Server connected!'));