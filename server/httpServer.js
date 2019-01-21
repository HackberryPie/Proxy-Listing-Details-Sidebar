const http = require('http');
const path = require('path');
const fs = require('fs');
const port = 4000;

const cache = {};

let html;

let proxyOptions = {
  hostname: '',
  port: 80,
  path: '',
  method: 'GET'
};

const urls = {
  details: '18.188.219.64',
  carousel: '18.188.188.228',
  similarlistings: '54.82.218.221'
};

const isStatic = (url) => {
  if (url.substring(-3).includes('.')) {
    return true;
  } else {
    return false;
  }
};

const isGoodUrl = (url) => {
  const isolate = url.substring(1, url.length - 1);
  return typeof Number(isolate) === 'number';
};

const requestHandler = (client_req, client_res) => {
  //STATIC ASSETS
  if (isStatic(client_req.url)) {
    return serveStatic(client_req, client_res);
  }

  //PROXY EVERYTHING ELSE
  if (client_req.url.includes('/api/')) {
    let HOSTNAMEURL = '';
    if (client_req.url.includes('/api/details/')) {
      HOSTNAMEURL = urls.details;
      proxyOptions.port = 80;
    } else if (client_req.url.includes('/api/carousel/')) {
      HOSTNAMEURL = urls.carousel;
      proxyOptions.port = 3010;
    } else if (client_req.url.includes('/api/similarlistings/')) {
      HOSTNAMEURL = urls.similarlistings;
      proxyOptions.port = 80;
    }
    proxyOptions.hostname = HOSTNAMEURL;
    proxyOptions.path = client_req.url;
    const proxy = http.request(proxyOptions, (res) => {
      res.pipe(
        client_res,
        { end: true }
      );
    });

    proxy.on('error', (err) => {
      console.log(err);
    });
    if (HOSTNAMEURL !== '') {
      client_req.pipe(
        proxy,
        { end: true }
      );
    }
  } else if (isGoodUrl(client_req.url)) {
    //INITIAL REQUEST
    client_res.writeHead(200, { 'Content-Type': 'text/html' });
    client_res.write(html);
    client_res.end();
  }
};

//handle static assets
const basePath = './public';
const serveStatic = (req, res) => {
  const resolvedBase = path.resolve(basePath);
  const safeSuffix = path.normalize(req.url).replace(/^(\.\.[\/\\])+/, '');
  const fileLoc = path.join(resolvedBase, safeSuffix);

  if (cache[fileLoc] !== undefined) {
    res.statusCode = 200;
    res.write(cache[fileLoc]);
    return res.end();
  }

  fs.readFile(fileLoc, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.write('ERROR 404: Not found');
      return res.end;
    }

    cache[fileLoc] = data;

    res.statusCode = 200;
    res.write(data);
    return res.end();
  });
};

//handle main index
fs.readFile('./templates/index.html', (err, htmlFile) => {
  if (err) {
    console.log(err);
  } else {
    html = htmlFile;
    server = http.createServer(requestHandler).listen(port, (err) => {
      if (err) console.log(err);
      else console.log('listening on 4000');
    });
  }
});
