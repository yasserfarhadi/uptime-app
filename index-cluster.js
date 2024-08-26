const os = require('node:os');
const cluster = require('node:cluster');

const server = require('./lib/server');
const workers = require('./lib/workers');
const cli = require('./lib/cli');

const app = {};

app.init = function (callback) {
  if (cluster.isMaster) {
    // If we're on the mster thread start the background workers and the cli.
    workers.init();

    setTimeout(function () {
      cli.init();
      callback();
    }, 50);

    // Fork the process
    for (let i = 0; i < os.cpus().length; i++) {
      cluster.fork();
    }
  } else {
    // If we're not on the master thread, start the server.
    server.init();
  }
};

// self invoking only if required direcly
if (require.main === module) {
  app.init(function () {});
}

module.exports = app;
