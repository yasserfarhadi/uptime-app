process.env.NODE_ENV = 'testing';

const _app = {};

_app.tests = {};

_app.tests.unut = require('./unit');
_app.tests.api = require('./api');

_app.countTests = function () {
  let counter = 0;
  for (const key in _app.tests) {
    if (_app.tests.hasOwnProperty(key)) {
      const subTests = _app.tests[key];
      for (const testName in subTests) {
        if (subTests.hasOwnProperty(testName)) {
          counter++;
        }
      }
    }
  }

  return counter;
};

_app.runTests = function () {
  const errors = [];
  let successes = 0;
  const limit = _app.countTests();
  let counter = 0;

  for (const key in _app.tests) {
    if (_app.tests.hasOwnProperty(key)) {
      const subTests = _app.tests[key];
      for (const testName in subTests) {
        if (subTests.hasOwnProperty(testName)) {
          (function () {
            const tmpTestName = testName;
            const testValue = subTests[testName];
            try {
              testValue(function () {
                console.log('\x1b[32m%s\x1b[0m', tmpTestName);
                counter++;
                successes++;
                if (counter === limit) {
                  _app.produceTestReport(limit, successes, errors);
                }
              });
            } catch (err) {
              errors.push({
                name: testName,
                error: err,
              });
              console.log('\x1b[31m%s\x1b[0m', tmpTestName);
              counter++;
              if (counter === limit) {
                _app.produceTestReport(limit, successes, errors);
              }
            }
          })();
        }
      }
    }
  }
};

_app.produceTestReport = function (limit, successes, errors) {
  console.log('');
  console.log('----------------BEGIN TEST REPORT----------------');
  console.log('');
  console.log('Total Tests: ', limit);
  console.log('Pass: ', successes);
  console.log('Fail: ', errors.length);
  console.log('');

  if (errors.length > 0) {
    console.log('----------------BEGIN Error Details----------------');
    console.log('');
    errors.forEach(function (testError) {
      console.log('\x1b[31m%s\x1b[0m', testError.name);
      console.log(testError.error);
      console.log('');
    });
    console.log('');
    console.log('----------------End Error Details----------------');
  }
  console.log('');
  console.log('----------------End TEST REPORT----------------');
  process.exit(0);
};

_app.runTests();
