const crypto = require('node:crypto');
const queryString = require('node:querystring');
const https = require('node:https');
const config = require('../config');

const helpers = {};

helpers.hash = function (string) {
  if (typeof string === 'string' && string.length > 0) {
    const hash = crypto
      .createHmac('sha256', config.hashingSecret)
      .update(string)
      .digest('hex');

    return hash;
  } else {
    return false;
  }
};

helpers.parseJsonToObject = function (string) {
  try {
    return JSON.parse(string);
  } catch (err) {
    return {};
  }
};

helpers.createRandomString = function (length) {
  length = typeof length === 'number' && length > 0 ? length : false;
  let out = '';
  if (length) {
    for (let i = 0; i < length; i++) {
      const random = Math.floor(Math.random() * (90 - 65) + 65);
      out += String.fromCharCode(random);
    }
    return out;
  } else {
    return false;
  }
};

helpers.sendTwilioSms = function (phone, msg, callback) {
  phone =
    typeof phone === 'string' && phone.trim().length === 10
      ? phone.trim()
      : false;
  msg =
    typeof msg === 'string' && msg.trim().length <= 960 ? msg.trim() : false;

  if (phone && msg) {
    const payload = {
      From: config.twilio.fromPhone,
      To: '+1' + phone,
      Body: msg,
    };

    const stringPayload = queryString.stringify(payload);

    const requiuestDetails = {
      protocol: 'https:',
      hostname: 'api.twilio.com',
      method: 'POST',
      path:
        '/2010-04-01/Accounts/' + config.twilio.accountSid + '/Messages.json',
      auth: config.twilio.accountSid + ':' + config.twilio.authToken,
      headers: {
        'Content-Type': 'applicationx-www-from-urlencoded',
        'Content-Length': Buffer.byteLength(stringPayload),
      },
    };
    const req = https.request(requiuestDetails, function (res) {
      const status = res.statusCode;
      if (status === 200 || status === 201) {
        callback(false);
      } else {
        callback('Status code returned was: ' + status);
      }
    });

    req.on('error', function (e) {
      callback(e);
    });

    req.write(stringPayload);

    req.end();
  } else {
    callback('Given parameters were missing of invalid.');
  }
};

module.exports = helpers;
