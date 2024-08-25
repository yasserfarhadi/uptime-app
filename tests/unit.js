const assert = require('node:assert');
const helpers = require('../lib/helpers');
const logs = require('./../lib/logs');

const unit = {};

unit['logs.list should callback a false error and an array of log names'] =
  function (done) {
    logs.list(true, function (err, logList) {
      assert.equal(typeof logList, 'object');
      assert.ok(logList instanceof Array);
      assert.equal(err, false);
      done();
    });
  };

unit[
  "logs.truncate should not throw if the logId doesn't exist, it should callback an error instead"
] = function (done) {
  assert.doesNotThrow(function () {
    logs.truncate('An id that does not exist', function (err) {
      assert.ok(err);
      done();
    });
  }, TypeError);
};

module.exports = unit;
