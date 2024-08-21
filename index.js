const http = require('node:http');
const https = require('node:https');
const url = require('node:url');
const config = require('./config');
const fs = require('node:fs');

const StringDecoder = require('node:string_decoder').StringDecoder;

const httpServer = http.createServer(function (req, res) {
  unifiedServer(req, res);
});

httpServer.listen(config.httpPort, function () {
  console.log(`The server listening on port ${config.httpPort}.`);
});

const httpsServerOptions = {
  key: fs.readFileSync('./https/key.pem'),
  cert: fs.readFileSync('./https/cert.pem'),
};

const httpsServer = https.createServer(httpsServerOptions, function (req, res) {
  unifiedServer(req, res);
});

httpsServer.listen(config.httpsPort, function () {
  console.log(`The server listening on port ${config.httpsPort}.`);
});

function unifiedServer(req, res) {
  const parsedUrl = url.parse(req.url, true);

  const path = parsedUrl.pathname;

  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  const method = req.method.toLowerCase();
  const query = parsedUrl.query;
  const headers = req.headers;

  const decoder = new StringDecoder('utf-8');

  let buffer = '';

  req.on('data', function (data) {
    buffer += decoder.write(data);
  });

  req.on('end', function () {
    buffer += decoder.end();

    const handler = handlers[trimmedPath] || handlers.notFound;
    const data = {
      trimmedPath,
      queryStringObject: query,
      method,
      headers,
      payload: buffer,
    };

    handler(data, function (statusCode, payload) {
      statusCode = typeof statusCode === 'number' ? statusCode : 200;
      payload = typeof payload === 'object' ? payload : {};

      const stringPayload = JSON.stringify(payload);

      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(stringPayload);
      console.log(`Returning this response: ${statusCode} ${stringPayload}`);
    });
  });
}

const handlers = {};

handlers.ping = function (_data, callback) {
  callback(200);
};

handlers.notFound = function (data, callback) {
  callback(404);
};

const router = {
  ping: handlers.ping,
};
