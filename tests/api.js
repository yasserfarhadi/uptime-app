const assert = require('node:assert');
const http = require('node:http');
const app = require('./../index');
const config = require('./../config');

const api = {};

const helpers = {};
helpers.makeGetRequest = function (path, callback) {
  const requestDetails = {
    protocol: 'http:',
    hostName: 'localhost',
    port: config.httpPort,
    method: 'GET',
    path,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const req = http.request(requestDetails, function (res) {
    callback(res);
  });
  req.end();
};

api['app.init should start without throwing'] = function (done) {
  assert.doesNotThrow(function () {
    app.init(function (err) {
      done();
    });
  }, TypeError);
};

api['/ping should respond to get with 200'] = function (done) {
  helpers.makeGetRequest('/ping', function (res) {
    assert.equal(res.statusCode, 200);
    done();
  });
};

api['/api/users should respond to get with 400(without headers)'] = function (
  done
) {
  helpers.makeGetRequest('/api/users', function (res) {
    assert.equal(res.statusCode, 400);
    done();
  });
};

api['A random path should respond to GET with 404'] = function (done) {
  helpers.makeGetRequest('/this/path/should/not/exist', function (res) {
    assert.equal(res.statusCode, 404);
    done();
  });
};

module.exports = api;
