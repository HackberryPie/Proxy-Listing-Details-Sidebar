const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
const compression = require('compression');

////////////////////////////////////////
//  Remote Server Endpoints
const service_urls = require('../service_urls.json');

let app = express();

let PORT = process.env.PORT || 3000;

let staticPath = path.join(__dirname, '../public');

////////////////////
//  Apply Middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(compression());

// Use EJS templating
app.set('view engine', 'ejs');

/////////////////////
//  Render index.html from Template
app.get('/:id(\\d+)/', (req, res) => {
  res.render(
    path.join(__dirname, '../templates/index.ejs'),
    service_urls,
    (err, html) => {
      if (err) {
        console.log('Error rendering HTML:', err);
        return res.sendStatus(500);
      }
      res.send(html);
    }
  );
});

/////////////////////
//  Serve Other Static Assets
app.use('/:id(\\d+)/', express.static(staticPath));
app.use('/', express.static(staticPath));

////////////////////////////////////////
//  API Call Redirection

// Carousel
app.get(service_urls.carousel.LOCAL_API_TARGET, (req, res) => {
  const itemId = req.params.id;
  axios
    .get(service_urls.carousel.API_URL + itemId)
    .then(result => {
      res.json(result.data);
    })
    .catch(err => {
      console.log('Error fetching from carousel API:', err);
      res.sendStatus(500);
    });
});

// Details
app.get(service_urls.details.LOCAL_API_TARGET, (req, res) => {
  const itemId = req.params.id;
  axios
    .get(service_urls.details.API_URL + itemId)
    .then(result => {
      res.json(result.data);
    })
    .catch(err => {
      console.log('Error fetching from details API:', err);
      res.sendStatus(500);
    });
});

// Description
app.get(service_urls.description.LOCAL_API_TARGET, (req, res) => {
  const itemId = req.params.id;
  axios
    .get(service_urls.description.API_URL + itemId)
    .then(result => {
      res.json(result.data);
    })
    .catch(err => {
      console.log('Error fetching from description API:', err);
      res.sendStatus(500);
    });
});

// Similar Listings
app.get(service_urls.similar.LOCAL_API_TARGET, (req, res) => {
  const itemId = req.params.id;
  axios
    .get(service_urls.similar.API_URL + itemId)
    .then(result => {
      res.json(result.data);
    })
    .catch(err => {
      console.log('Error fetching from similar listings API:', err);
      res.sendStatus(500);
    });
});

////////////////////////////////////////
//  Instantate Server
app.listen(PORT, err => {
  if (err) return console.log('Error starting server:', err);
  console.log('Succesfully started server on:', PORT);
});
