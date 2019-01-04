const express = require('express');
const proxy = require('http-proxy-middleware');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.use("/", proxy({
    target: "http://127.0.0.1:3012/", 
    changeOrigin: true 
}));

app.listen(3000, () => console.log('Proxy Server connected!'));