const crypto = require('node:crypto');
const queryString = require('node:querystring');
const https = require('node:https');
const path = require('node:path');
const fs = require('node:fs');
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

helpers.getTemplate = function (templateName, data, callback) {
  templateName =
    typeof templateName === 'string' && templateName.length > 0
      ? templateName
      : false;
  data = typeof data === 'object' && data !== null ? data : {};
  if (templateName) {
    const templateDir = path.join(__dirname, '/../templates/');
    fs.readFile(
      `${templateDir}${templateName}.html`,
      'utf-8',
      function (err, str) {
        if (!err && str && str.length > 0) {
          const finalString = helpers.interpolate(str, data);

          callback(false, finalString);
        } else {
          callback('No template found');
        }
      }
    );
  } else {
    callback('A valid template name was not specified.');
  }
};

helpers.interpolate = function (str, data) {
  str = typeof str === 'string' && str.length > 0 ? str : '';
  data = typeof data === 'object' && data !== null ? data : {};

  for (const keyName in config.templateGlobals) {
    if (config.templateGlobals.hasOwnProperty(keyName)) {
      data['global.' + keyName] = config.templateGlobals[keyName];
    }
  }

  for (const key in data) {
    if (data.hasOwnProperty(key) && typeof data[key] === 'string') {
      const replace = data[key];
      const find = `{${key}}`;
      str = str.replace(find, replace);
    }
  }

  return str;
};

helpers.addUniversalTemplates = function (str, data, callback) {
  str = typeof str === 'string' && str.length > 0 ? str : '';
  data = typeof data === 'object' && data !== null ? data : {};

  helpers.getTemplate('_header', data, function (err, headerString) {
    if (!err && headerString) {
      helpers.getTemplate('_footer', data, function (err, footerString) {
        if (!err && footerString) {
          const fullString = headerString + str + footerString;
          callback(false, fullString);
        } else {
          callback('Could not find the footer template');
        }
      });
    } else {
      callback('Could not find the header string');
    }
  });
};

helpers.getStaticAsset = function (fileName, callback) {
  fileName =
    typeof fileName === 'string' && fileName.length > 0 ? fileName : false;
  if (fileName) {
    const publicDir = path.join(__dirname, '/../public/');
    fs.readFile(publicDir + fileName, function (err, data) {
      if (!err && data) {
        callback(false, data);
      } else {
        callback('No file found');
      }
    });
  } else {
    callback('A valid fileName was no specified');
  }
};

module.exports = helpers;
