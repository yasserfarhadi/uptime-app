const path = require('node:path');
const fs = require('node:fs');
const https = require('node:https');
const http = require('node:http');
const url = require('node:url');
const _data = require('./data');
const helpers = require('./helpers');

const workers = {};

workers.loop = function () {
  setInterval(function () {
    workers.gatherAllChecks();
  }, 1000 * 5);
};

workers.validateCheckData = function (check) {
  check = typeof check === 'object' && check !== null ? check : {};
  check.id =
    typeof check.id === 'string' && check.id.trim().length === 20
      ? check.id
      : false;
  check.userPhone =
    typeof check.userPhone === 'string' && check.userPhone.trim().length === 10
      ? check.userPhone
      : false;
  check.protocol =
    typeof check.protocol === 'string' &&
    ['http', 'https'].indexOf(check.protocol) > -1
      ? check.protocol
      : false;
  check.url =
    typeof check.url === 'string' && check.url.trim().length > 0
      ? check.url
      : false;
  check.method =
    typeof check.method === 'string' &&
    ['post', 'get', 'put', 'delete'].indexOf(check.method) > -1
      ? check.method
      : false;
  check.successCodes =
    typeof check.successCodes === 'object' &&
    check.successCodes instanceof Array &&
    check.successCodes.length > 0
      ? check.successCodes
      : false;
  check.timeoutSeconds =
    typeof check.timeoutSeconds === 'number' &&
    check.timeoutSeconds % 1 === 0 &&
    check.timeoutSeconds >= 1 &&
    check.timeoutSeconds <= 5
      ? check.timeoutSeconds
      : false;

  check.state =
    typeof check.state === 'string' && ['up', 'down'].indexOf(check.state) > -1
      ? check.state
      : 'down';

  check.lastChecked =
    typeof check.lastChecked === 'number' && check.lastChecked > 0
      ? check.lastChecked
      : false;

  if (
    check.id &&
    check.userPhone &&
    check.protocol &&
    check.url &&
    check.method &&
    check.successCodes &&
    check.timeoutSeconds
  ) {
    workers.performCheck(check);
  } else {
    console.log('Error: One of the checks is not properly formatted.');
  }
};

workers.performCheck = function (check) {
  const checkOutcome = {
    error: false,
    response: false,
  };

  let outcomeSent = false;

  const parsedUrl = url.parse(`${check.protocol}://${check.url}`, true);
  const hostname = parsedUrl.hostname;
  const path = parsedUrl.path;

  const requestDetails = {
    protocol: check.protocol + ':',
    hostname,
    method: check.method.toUpperCase(),
    path,
    timeout: check.timeoutSeconds * 1000,
  };

  const _moduleToUse = check.protocol === 'http' ? http : https;
  const req = _moduleToUse.request(requestDetails, function (res) {
    const status = res.statusCode;
    checkOutcome.response = status;
    if (!outcomeSent) {
      workers.processCheckOutcome(check, checkOutcome);
      outcomeSent = true;
    }
  });

  req.on('error', function (e) {
    checkOutcome.error = {
      error: true,
      value: e,
    };
    if (!outcomeSent) {
      workers.processCheckOutcome(check, checkOutcome);
      outcomeSent = true;
    }
  });
  req.on('timeout', function (e) {
    checkOutcome.error = {
      error: true,
      value: 'timeout',
    };
    if (!outcomeSent) {
      workers.processCheckOutcome(check, checkOutcome);
      outcomeSent = true;
    }
  });

  req.end();
};

workers.processCheckOutcome = function (check, checkOutcome) {
  const state =
    !checkOutcome.error &&
    checkOutcome.response &&
    check.successCodes.indexOf(checkOutcome.response) > -1
      ? 'up'
      : 'down';

  const alertWarranted =
    check.lastChecked && check.state !== state ? true : false;

  const timeOfCheck = Date.now();
  const newCheckData = check;
  newCheckData.state = state;
  newCheckData.lastChecked = timeOfCheck;

  console.log(check, checkOutcome, state, alertWarranted, timeOfCheck);

  _data.update('checks', newCheckData.id, newCheckData, function (err) {
    if (!err) {
      if (alertWarranted) {
        workers.alertUserToStatusChange(newCheckData);
      } else {
        console.log('Check outcome has not changed, no alert needed.');
      }
    } else {
      console.log('Error trying to save updates to one if the checks');
    }
  });
};

workers.alertUserToStatusChange = function (newCheckData) {
  const msg = `Alert: Your check for ${newCheckData.method.toUpperCase()} ${
    newCheckData.protocol
  }://${newCheckData.url} is currently ${newCheckData.state}`;

  helpers.sendTwilioSms(newCheckData.userPhone, msg, function (err) {
    if (!err) {
      console.log(
        'Success: User was alerted to a status change in their checks, via sms: ',
        msg
      );
    } else {
      console.log(
        'Could not send sms alert to user who had a state change in their checks.'
      );
    }
  });
};

workers.gatherAllChecks = function () {
  _data.list('checks', function (err, checks) {
    if (!err && checks.length > 0) {
      checks.forEach(function (check) {
        _data.read('checks', check, function (err, originalCheckData) {
          if (!err && originalCheckData) {
            workers.validateCheckData(originalCheckData);
          } else {
            console.log("Error: Reading one of the check's data");
          }
        });
      });
    } else {
      console.log('Error: Could not find any checks to process');
    }
  });
};

workers.init = function () {
  workers.gatherAllChecks();

  workers.loop();
};

module.exports = workers;
