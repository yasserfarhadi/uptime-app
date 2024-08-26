const _url = require('node:url');
const dns = require('node:dns');
const _performance = require('node:perf_hooks').performance;
const util = require('node:util');
const _data = require('./data');
const helpers = require('./helpers');
const config = require('../config');

const debug = util.debuglog('performance');

const handlers = {};

handlers.index = function (data, callback) {
  if (data.method === 'get') {
    const templateData = {
      'head.title': 'Uptime monitoring',
      'head.description':
        "Uptime monitoring for HTTP/HTTPS sites of all kinds. When your site goes down we'll send you a text to let you know.",
      'body.class': 'index',
    };

    helpers.getTemplate('index', templateData, function (err, str) {
      if (!err && str) {
        helpers.addUniversalTemplates(str, templateData, function (err, str) {
          if (!err && str) {
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};

handlers.accountCreate = function (data, callback) {
  if (data.method === 'get') {
    const templateData = {
      'head.title': 'Crate an account',
      'head.description': 'Sign up is easy and only takes a few seconds.',
      'body.class': 'accountCreate',
    };

    helpers.getTemplate('accountCreate', templateData, function (err, str) {
      if (!err && str) {
        helpers.addUniversalTemplates(str, templateData, function (err, str) {
          if (!err && str) {
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};
handlers.sessionCreate = function (data, callback) {
  if (data.method === 'get') {
    const templateData = {
      'head.title': 'Login to your account',
      'head.description':
        'Please enter your phone number and password to access your account.',
      'body.class': 'sessionCreate',
    };

    helpers.getTemplate('sessionCreate', templateData, function (err, str) {
      if (!err && str) {
        helpers.addUniversalTemplates(str, templateData, function (err, str) {
          if (!err && str) {
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};
handlers.sessionDeleted = function (data, callback) {
  if (data.method === 'get') {
    const templateData = {
      'head.title': 'Logged out',
      'head.description': 'You have been logged out of your account.',
      'body.class': 'sessionDeleted',
    };

    helpers.getTemplate('sessionDeleted', templateData, function (err, str) {
      if (!err && str) {
        helpers.addUniversalTemplates(str, templateData, function (err, str) {
          if (!err && str) {
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};
handlers.accountEdit = function (data, callback) {
  if (data.method === 'get') {
    const templateData = {
      'head.title': 'Account settings',
      'body.class': 'accountEdit',
    };

    helpers.getTemplate('accountEdit', templateData, function (err, str) {
      if (!err && str) {
        helpers.addUniversalTemplates(str, templateData, function (err, str) {
          if (!err && str) {
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};
handlers.accountDeleted = function (data, callback) {
  if (data.method === 'get') {
    const templateData = {
      'head.title': 'Account Deleted',
      'head.description': 'Your account has been deleted.',
      'body.class': 'accountDeleted',
    };

    helpers.getTemplate('accountDeleted', templateData, function (err, str) {
      if (!err && str) {
        helpers.addUniversalTemplates(str, templateData, function (err, str) {
          if (!err && str) {
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};
handlers.checksCreate = function (data, callback) {
  if (data.method === 'get') {
    const templateData = {
      'head.title': 'Create a new check',
      'body.class': 'checksCreate',
    };

    helpers.getTemplate('checksCreate', templateData, function (err, str) {
      if (!err && str) {
        helpers.addUniversalTemplates(str, templateData, function (err, str) {
          if (!err && str) {
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};
handlers.checksList = function (data, callback) {
  if (data.method === 'get') {
    const templateData = {
      'head.title': 'Dashboard',
      'body.class': 'checksList',
    };

    helpers.getTemplate('checksList', templateData, function (err, str) {
      if (!err && str) {
        helpers.addUniversalTemplates(str, templateData, function (err, str) {
          if (!err && str) {
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};
handlers.checksEdit = function (data, callback) {
  if (data.method === 'get') {
    const templateData = {
      'head.title': 'Check Details',
      'body.class': 'checksEdit',
    };

    helpers.getTemplate('checksEdit', templateData, function (err, str) {
      if (!err && str) {
        helpers.addUniversalTemplates(str, templateData, function (err, str) {
          if (!err && str) {
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};

handlers.favicon = function (data, callback) {
  if (data.method === 'get') {
    helpers.getStaticAsset('favicon.ico', function (err, data) {
      if (!err && data) {
        callback(200, data, 'favicon');
      } else {
        callback(500);
      }
    });
  } else {
    callback(405);
  }
};

handlers.public = function (data, callback) {
  if (data.method === 'get') {
    const trimmedAssetName = data.trimmedPath.replace('public/', '').trim();
    if (trimmedAssetName.length > 0) {
      helpers.getStaticAsset(trimmedAssetName, function (err, data) {
        if ((!err, data)) {
          let contentType = 'plain';

          if (trimmedAssetName.indexOf('.css') > -1) {
            contentType = 'css';
          }
          if (trimmedAssetName.indexOf('.png') > -1) {
            contentType = 'png';
          }
          if (trimmedAssetName.indexOf('.jpg') > -1) {
            contentType = 'jpg';
          }
          if (trimmedAssetName.indexOf('.ico') > -1) {
            contentType = 'favicon';
          }

          callback(200, data, contentType);
        } else {
          callback(404);
        }
      });
    }
  } else {
    callback(405);
  }
};

handlers.ping = function (_data, callback) {
  callback(200);
};

handlers.notFound = function (_data, callback) {
  callback(404);
};

handlers._users = {};
handlers._users.post = function (data, callback) {
  const firstName =
    typeof data.payload.firstName === 'string' &&
    data.payload.firstName.trim().length > 0
      ? data.payload.firstName
      : false;
  const lastName =
    typeof data.payload.lastName === 'string' &&
    data.payload.lastName.trim().length > 0
      ? data.payload.lastName
      : false;
  const phone =
    typeof data.payload.phone === 'string' &&
    data.payload.phone.trim().length === 10
      ? data.payload.phone
      : false;
  const password =
    typeof data.payload.password === 'string' &&
    data.payload.password.trim().length > 0
      ? data.payload.password
      : false;
  const tosAgreement =
    typeof data.payload.tosAgreement === 'boolean' && data.payload.tosAgreement;
  if (firstName && lastName && phone && password && tosAgreement) {
    _data.read('users', phone, function (err, data) {
      if (err) {
        // user does not exit so we create one
        const hashedPassword = helpers.hash(password);
        if (hashedPassword) {
          const user = {
            firstName,
            lastName,
            phone,
            password: hashedPassword,
            tosAgreement,
          };

          _data.create('users', phone, user, function (err) {
            if (!err) {
              callback(200);
            } else {
              console.log(err);
              callback(500, { Error: 'Could not create the new user.' });
            }
          });
        } else {
          callback(500, { Error: "Could not has the user's password." });
        }
      } else {
        // User with the phone number already exist
        callback(400, {
          Error: 'A user with that phone number already exist.',
        });
      }
    });
  } else {
    callback(400, { Error: 'Missing required fields.' });
  }
};
handlers._users.get = function (data, callback) {
  const phone =
    typeof data.queryStringObject.phone === 'string' &&
    data.queryStringObject.phone.trim().length === 10
      ? data.queryStringObject.phone
      : false;
  if (phone) {
    const token =
      typeof data.headers.token === 'string' &&
      data.headers.token.trim().length === 20
        ? data.headers.token
        : false;

    handlers._tokens.verifyToken(token, phone, function (tokenIsValid) {
      if (tokenIsValid) {
        _data.read('users', phone, function (err, data) {
          if (!err && data) {
            delete data.password;
            callback(200, data);
          } else {
            callback(404);
          }
        });
      } else {
        callback(403, {
          Error: 'Missing required token in header or token is invalid.',
        });
      }
    });
  } else {
    callback(400, { Error: 'Missing required filed' });
  }
};
handlers._users.put = function (data, callback) {
  const phone =
    typeof data.payload.phone === 'string' &&
    data.payload.phone.trim().length === 10
      ? data.payload.phone
      : false;

  const firstName =
    typeof data.payload.firstName === 'string' &&
    data.payload.firstName.trim().length > 0
      ? data.payload.firstName
      : false;
  const lastName =
    typeof data.payload.lastName === 'string' &&
    data.payload.lastName.trim().length > 0
      ? data.payload.lastName
      : false;
  const password =
    typeof data.payload.password === 'string' &&
    data.payload.password.trim().length > 0
      ? data.payload.password
      : false;

  if (phone) {
    if (firstName || lastName || password) {
      const token =
        typeof data.headers.token === 'string' &&
        data.headers.token.trim().length === 20
          ? data.headers.token
          : false;

      handlers._tokens.verifyToken(token, phone, function (tokenIsValid) {
        if (tokenIsValid) {
          _data.read('users', phone, function (err, userData) {
            if (!err && userData) {
              if (firstName) {
                userData.firstName = firstName;
              }
              if (lastName) {
                userData.lastName = lastName;
              }
              if (password) {
                userData.password = helpers.hash(password);
              }

              _data.update('users', phone, userData, function (err) {
                if (!err) {
                  callback(200);
                } else {
                  console.log(err);
                  callback(500, { Error: 'Cound not update the user' });
                }
              });
            } else {
              callback(400, { Error: 'User not exist' });
            }
          });
        } else {
          callback(403, {
            Error: 'Missing required token in header or token is invalid.',
          });
        }
      });
    } else {
      callback(400, { Error: 'Atlead one filed must be provided.' });
    }
  } else {
    callback(400, { Error: 'Missing required fileds.' });
  }
};
handlers._users.delete = function (data, callback) {
  const phone =
    typeof data.queryStringObject.phone === 'string' &&
    data.queryStringObject.phone.trim().length === 10
      ? data.queryStringObject.phone
      : false;
  if (phone) {
    const token =
      typeof data.headers.token === 'string' &&
      data.headers.token.trim().length === 20
        ? data.headers.token
        : false;

    handlers._tokens.verifyToken(token, phone, function (tokenIsValid) {
      if (tokenIsValid) {
        _data.read('users', phone, function (err, userData) {
          if (!err && userData) {
            _data.delete('users', phone, function (err) {
              if (!err) {
                const userChecks =
                  typeof userData.checks === 'object' &&
                  userData.checks instanceof Array
                    ? userData.checks
                    : [];
                if (userChecks.length > 0) {
                  let deletionErrors = false;
                  let checksDeleted = 0;
                  userChecks.forEach(function (check) {
                    _data.delete('checks', check, function (err) {
                      if (err) {
                        deletionErrors = true;
                      }
                      checksDeleted++;
                      if (checksDeleted === userChecks.length) {
                        if (!deletionErrors) {
                          callback(200);
                        } else {
                          callback(500, {
                            Error:
                              "Errors encontered while atempting to delete all the user's checks. All checks my not have been deleted.",
                          });
                        }
                      }
                    });
                  });
                } else {
                  callback(200);
                }
              } else {
                callback(500, { Error: 'Could not delete the user.' });
              }
            });
          } else {
            callback(400, { Error: 'User not found' });
          }
        });
      } else {
        callback(403, {
          Error: 'Missing required token in header or token is invalid.',
        });
      }
    });
  } else {
    callback(400, { Error: 'Missing required filed' });
  }
};

handlers.users = function (data, callback) {
  const acceptableMethods = ['post', 'get', 'put', 'delete'];
  if (acceptableMethods.indexOf(data.method) > -10) {
    handlers._users[data.method](data, callback);
  } else {
    // 405: method no allowed
    callback(405);
  }
};

// Tokens
handlers.tokens = function (data, callback) {
  const acceptableMethods = ['post', 'get', 'put', 'delete'];
  if (acceptableMethods.indexOf(data.method) > -10) {
    handlers._tokens[data.method](data, callback);
  } else {
    // 405: method no allowed
    callback(405);
  }
};

handlers._tokens = {};

handlers._tokens.post = function (data, callback) {
  _performance.mark('Entered function');
  const phone =
    typeof data.payload.phone === 'string' &&
    data.payload.phone.trim().length === 10
      ? data.payload.phone
      : false;
  const password =
    typeof data.payload.password === 'string' &&
    data.payload.password.trim().length > 0
      ? data.payload.password
      : false;

  _performance.mark('Inputs validated');
  if (phone && password) {
    _performance.mark('Beginning user lookup');
    _data.read('users', phone, function (err, userData) {
      _performance.mark('User lookup completed');
      if (!err && userData) {
        _performance.mark('Beginning password hassing');
        const hashedPassword = helpers.hash(password);
        _performance.mark('Complete password hassing');
        if (userData.password === hashedPassword) {
          _performance.mark('Create data for token');
          const tokenId = helpers.createRandomString(20);
          const expires = Date.now() + 1000 * 60 * 60;
          const tokenObj = {
            phone,
            id: tokenId,
            expires,
          };

          _performance.mark('Beginning storing token');
          _data.create('tokens', tokenId, tokenObj, function (err) {
            _performance.mark('Storing token complete');

            _performance.measure(
              'Beginning to end',
              'Entered function',
              'Storing token complete'
            );
            _performance.measure(
              'Validatin user input',
              'Entered function',
              'Inputs validated'
            );
            _performance.measure(
              'User lookup',
              'Beginning user lookup',
              'User lookup completed'
            );
            _performance.measure(
              'Password hashing',
              'Beginning password hassing',
              'Complete password hassing'
            );
            _performance.measure(
              'Token data creation',
              'Create data for token',
              'Beginning storing token'
            );
            _performance.measure(
              'Storing token',
              'Beginning storing token',
              'Storing token complete'
            );

            const measurements = _performance.getEntriesByType('measure');
            measurements.forEach((measure) => {
              debug('\x1b[33m%s\x1b[0m', `${measure.name} ${measure.duration}`);
            });
            if (!err) {
              callback(200, tokenObj);
            } else {
              callback(500, { Error: 'Could not create the new token.' });
            }
          });
        } else {
          callback(400, { Error: 'Wrong password' });
        }
      } else {
        callback(400, { Error: 'User not found' });
      }
    });
  } else {
    callback(400, { Erorr: 'Missing required fields.' });
  }
};
handlers._tokens.get = function (data, callback) {
  const id =
    typeof data.queryStringObject.id === 'string' &&
    data.queryStringObject.id.trim().length === 20
      ? data.queryStringObject.id
      : false;
  if (id) {
    _data.read('tokens', id, function (err, data) {
      if (!err && data) {
        callback(200, data);
      } else {
        callback(404);
      }
    });
  } else {
    callback(400, { Error: 'Missing required filed' });
  }
};
handlers._tokens.put = function (data, callback) {
  // when requested extend for one hour
  const id =
    typeof data.payload.id === 'string' && data.payload.id.trim().length === 20
      ? data.payload.id
      : false;
  const extend =
    typeof data.payload.extend === 'boolean' && data.payload.extend;

  if (id && extend) {
    _data.read('tokens', id, function (err, data) {
      if (!err && data) {
        if (data.expires > Date.now()) {
          data.expires = Date.now() + 1000 * 60 * 60;
          _data.update('tokens', id, data, function (err) {
            if (!err) {
              callback(200);
            } else {
              callback(500, { Error: 'Could not update the token expiration' });
            }
          });
        } else {
          callback(400, {
            Error: 'Token cannot be extended because aleady expired.',
          });
        }
      } else {
        callback(400, { Error: "Token doesn't exist." });
      }
    });
  } else {
    callback(400, { Error: 'Missing required fields or fileds are invalid' });
  }
};
handlers._tokens.delete = function (data, callback) {
  const id =
    typeof data.queryStringObject.id === 'string' &&
    data.queryStringObject.id.trim().length === 20
      ? data.queryStringObject.id
      : false;
  if (id) {
    _data.read('tokens', id, function (err, data) {
      if (!err && data) {
        _data.delete('tokens', id, function (err) {
          if (!err) {
            callback(200);
          } else {
            callback(500, { Error: 'Could not delete the token.' });
          }
        });
      } else {
        callback(400, { Error: 'Token not found' });
      }
    });
  } else {
    callback(400, { Error: 'Missing required filed' });
  }
};

handlers._tokens.verifyToken = function (id, phone, callback) {
  _data.read('tokens', id, function (err, data) {
    if (!err && data) {
      if (data.phone === phone && data.expires > Date.now()) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};

handlers.checks = function (data, callback) {
  const acceptableMethods = ['post', 'get', 'put', 'delete'];
  if (acceptableMethods.indexOf(data.method) > -10) {
    handlers._checks[data.method](data, callback);
  } else {
    // 405: method no allowed
    callback(405);
  }
};

handlers._checks = {};

handlers._checks.post = function (data, callback) {
  const protocol =
    typeof data.payload.protocol === 'string' &&
    ['http', 'https'].indexOf(data.payload.protocol) > -1
      ? data.payload.protocol
      : false;
  const url =
    typeof data.payload.url === 'string' && data.payload.url.trim().length > 0
      ? data.payload.url
      : false;

  const method =
    typeof data.payload.method === 'string' &&
    ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1
      ? data.payload.method
      : false;

  const successCodes =
    typeof data.payload.successCodes === 'object' &&
    data.payload.successCodes instanceof Array &&
    data.payload.successCodes.length > 0
      ? data.payload.successCodes
      : false;

  const timeoutSeconds =
    typeof data.payload.timeoutSeconds === 'number' &&
    data.payload.timeoutSeconds % 1 === 0 &&
    data.payload.timeoutSeconds >= 1 &&
    data.payload.timeoutSeconds <= 5
      ? data.payload.timeoutSeconds
      : false;

  console.log({ timeoutSeconds, successCodes, method, url, protocol });

  if (protocol && url && method && successCodes && timeoutSeconds) {
    const token =
      typeof data.headers.token === 'string' &&
      data.headers.token.trim().length === 20
        ? data.headers.token
        : false;

    _data.read('tokens', token, function (err, data) {
      if (!err && data && data.expires > Date.now()) {
        const userPhone = data.phone;

        _data.read('users', userPhone, function (err, userData) {
          if (!err && userData) {
            userChecks =
              typeof userData.checks === 'object' &&
              userData.checks instanceof Array
                ? userData.checks
                : [];

            if (userChecks.length < config.maxChecks) {
              // verify that the url given has DNS entries(can resolve)
              const parsedUrl = _url.parse(protocol + '://' + url, true);
              const hostName =
                typeof parsedUrl.hostname === 'string' &&
                parsedUrl.hostname.length > 0
                  ? parsedUrl.hostname
                  : false;
              dns.resolve(hostName, function (err, records) {
                if (!err && records) {
                  const checkId = helpers.createRandomString(20);
                  const checkObj = {
                    id: checkId,
                    userPhone,
                    protocol,
                    url,
                    method,
                    successCodes,
                    timeoutSeconds,
                  };

                  _data.create('checks', checkId, checkObj, function (err) {
                    if (!err) {
                      userData.checks = userChecks;
                      userData.checks.push(checkId);

                      _data.update(
                        'users',
                        userPhone,
                        userData,
                        function (err) {
                          if (!err) {
                            callback(200, checkObj);
                          } else {
                            callback(500, {
                              Error:
                                'Could not update the user with the new check',
                            });
                          }
                        }
                      );
                    } else {
                      callback(500, {
                        Error: 'Could not create the new check.',
                      });
                    }
                  });
                } else {
                  callback(400, {
                    Error:
                      'The hostname of the URL entered did not resove to any DNS entries.',
                  });
                }
              });
            } else {
              callback(400, {
                Error: `The user already has the maximum number of checks: ${config.maxChecks}`,
              });
            }
          } else {
            callback(403);
          }
        });
      } else {
        callback(400, { Error: 'Not token or expired token' });
      }
    });
  } else {
    callback(400, { Error: 'Missing required inputs or inputs are invalid' });
  }
};

handlers._checks.get = function (data, callback) {
  const id =
    typeof data.queryStringObject.id === 'string' &&
    data.queryStringObject.id.trim().length === 20
      ? data.queryStringObject.id
      : false;
  if (id) {
    _data.read('checks', id, function (err, checkData) {
      if (!err && checkData) {
        const token =
          typeof data.headers.token === 'string' &&
          data.headers.token.trim().length === 20
            ? data.headers.token
            : false;

        handlers._tokens.verifyToken(
          token,
          checkData.userPhone,
          function (tokenIsValid) {
            if (tokenIsValid) {
              callback(200, checkData);
            } else {
              callback(403);
            }
          }
        );
      } else {
        callback(404);
      }
    });
  } else {
    callback(400, { Error: 'Missing required filed' });
  }
};

handlers._checks.put = function (data, callback) {
  const id =
    typeof data.payload.id === 'string' && data.payload.id.trim().length === 20
      ? data.payload.id
      : false;

  const protocol =
    typeof data.payload.protocol === 'string' &&
    ['http', 'https'].indexOf(data.payload.protocol) > -1
      ? data.payload.protocol
      : false;
  const url =
    typeof data.payload.url === 'string' && data.payload.url.trim().length > 0
      ? data.payload.url
      : false;

  const method =
    typeof data.payload.method === 'string' &&
    ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1
      ? data.payload.method
      : false;

  const successCodes =
    typeof data.payload.successCodes === 'object' &&
    data.payload.successCodes instanceof Array &&
    data.payload.successCodes.length > 0
      ? data.payload.successCodes
      : false;

  const timeoutSeconds =
    typeof data.payload.timeoutSeconds === 'number' &&
    data.payload.timeoutSeconds % 1 === 0 &&
    data.payload.timeoutSeconds >= 1 &&
    data.payload.timeoutSeconds <= 5
      ? data.payload.timeoutSeconds
      : false;

  if (id) {
    if (protocol || url || method || successCodes || timeoutSeconds) {
      _data.read('checks', id, function (err, checkData) {
        if (!err && checkData) {
          const token =
            typeof data.headers.token === 'string' &&
            data.headers.token.trim().length === 20
              ? data.headers.token
              : false;
          handlers._tokens.verifyToken(
            token,
            checkData.userPhone,
            function (isValid) {
              if (isValid) {
                if (protocol) {
                  checkData.protocol = protocol;
                }
                if (url) {
                  checkData.url = url;
                }
                if (method) {
                  checkData.method = method;
                }
                if (successCodes) {
                  checkData.successCodes = successCodes;
                }
                if (timeoutSeconds) {
                  checkData.timeoutSeconds = timeoutSeconds;
                }

                _data.update('checks', id, checkData, function (err) {
                  if (!err) {
                    callback(200);
                  } else {
                    console.log(err);
                    callback(500, { Error: 'Cound not update the user' });
                  }
                });
              } else {
                callback(403, {
                  Error:
                    'Missing required token in header or token is invalid.',
                });
              }
            }
          );
        } else {
          callback(400, { Error: 'Check not exist' });
        }
      });
    } else {
      callback(400, { Error: 'Atlead one filed must be provided.' });
    }
  } else {
    callback(400, { Error: 'Missing required fileds.' });
  }
};

handlers._checks.delete = function (data, callback) {
  const id =
    typeof data.queryStringObject.id === 'string' &&
    data.queryStringObject.id.trim().length === 20
      ? data.queryStringObject.id
      : false;

  if (id) {
    _data.read('checks', id, function (err, checkData) {
      if (!err && checkData) {
        const token =
          typeof data.headers.token === 'string' &&
          data.headers.token.trim().length === 20
            ? data.headers.token
            : false;

        handlers._tokens.verifyToken(
          token,
          checkData.userPhone,
          function (tokenIsValid) {
            if (tokenIsValid) {
              _data.delete('checks', id, function (err) {
                if (!err) {
                  _data.read(
                    'users',
                    checkData.userPhone,
                    function (err, userData) {
                      if (!err && userData) {
                        let userChecks =
                          typeof userData.checks === 'object' &&
                          userData.checks instanceof Array
                            ? userData.checks
                            : [];

                        userChecks = userChecks.filter((check) => check !== id);

                        _data.update(
                          'users',
                          userData.phone,
                          { ...userData, checks: userChecks },
                          function (err) {
                            if (!err) {
                              callback(200);
                            } else {
                              callback(500, {
                                Error: 'Could not update the users check list.',
                              });
                            }
                          }
                        );
                      } else {
                        callback(500, {
                          Error:
                            'Could not find the user who created the data, the user check list could not be updated.',
                        });
                      }
                    }
                  );
                } else {
                  callback(500, { Error: 'Could not delete the user.' });
                }
              });
            } else {
              callback(403, {
                Error: 'Missing required token in header or token is invalid.',
              });
            }
          }
        );
      } else {
        callback(400, { Error: 'Check not exist' });
      }
    });
  } else {
    callback(400, { Error: 'Missing required fields' });
  }
};

module.exports = handlers;
