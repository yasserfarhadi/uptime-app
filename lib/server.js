const http = require('node:http');
const https = require('node:https');
const url = require('node:url');
const path = require('node:path');
const fs = require('node:fs');
const util = require('node:util');
const StringDecoder = require('node:string_decoder').StringDecoder;
const config = require('../config');
const _data = require('./data');
const handlers = require('./handlers');
const helpers = require('./helpers');
const debug = util.debuglog('server');

const server = {};

server.httpServer = http.createServer(function (req, res) {
  server.unifiedServer(req, res);
});

server.httpsServerOptions = {
  key: fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
  cert: fs.readFileSync(path.join(__dirname, '/../https/cert.pem')),
};

server.httpsServer = https.createServer(
  server.httpsServerOptions,
  function (req, res) {
    server.unifiedServer(req, res);
  }
);

server.unifiedServer = function (req, res) {
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

    const handler = server.router[trimmedPath] || handlers.notFound;
    const data = {
      trimmedPath,
      queryStringObject: query,
      method,
      headers,
      payload: helpers.parseJsonToObject(buffer),
    };

    handler(data, function (statusCode, payload) {
      statusCode = typeof statusCode === 'number' ? statusCode : 200;
      payload = typeof payload === 'object' ? payload : {};

      const stringPayload = JSON.stringify(payload);

      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(stringPayload);
      if (statusCode === 200) {
        debug(
          '\x1b[32m%s\x1b[0m',
          `${method.toUpperCase()} /${trimmedPath} ${statusCode}`
        );
      } else {
        debug(
          '\x1b[31m%s\x1b[0m',
          `${method.toUpperCase()} /${trimmedPath} ${statusCode}`
        );
      }
    });
  });
};

server.router = {
  ping: handlers.ping,
  users: handlers.users,
  tokens: handlers.tokens,
  checks: handlers.checks,
};

server.init = function () {
  server.httpServer.listen(config.httpPort, function () {
    console.log(
      '\x1b[36m%s\x1b[0m',
      `The server listening on port ${config.httpPort}.`
    );
  });

  server.httpsServer.listen(config.httpsPort, function () {
    console.log(
      '\x1b[35m%s\x1b[0m',
      `The server listening on port ${config.httpsPort}.`
    );
  });
};

module.exports = server;
