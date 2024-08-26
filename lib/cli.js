const readline = require('node:readline');
const util = require('node:util');
const events = require('node:events');
const os = require('node:os');
const v8 = require('node:v8');
const _data = require('./data');
const _logs = require('./logs');
const helpers = require('./helpers');
const childProcess = require('node:child_process');

const debug = util.debuglog('cli');
class _events extends events {}
const e = new _events();

const cli = {};

e.on('man', function (str) {
  cli.responders.help();
});
e.on('help', function (str) {
  cli.responders.help();
});
e.on('exit', function (str) {
  cli.responders.exit();
});
e.on('stats', function (str) {
  cli.responders.stats();
});
e.on('list users', function (str) {
  cli.responders.listUsers();
});
e.on('more user info', function (str) {
  cli.responders.moreUserInfo(str);
});
e.on('list checks', function (str) {
  cli.responders.listChecks(str);
});
e.on('more check info', function (str) {
  cli.responders.moreCheckInfo(str);
});
e.on('list logs', function (str) {
  cli.responders.listLogs();
});
e.on('more log info', function (str) {
  cli.responders.moreLogInfo(str);
});

cli.responders = {};
cli.verticalSpace = function (lines) {
  lines = typeof lines === 'number' && lines > 0 ? lines : 1;
  for (let i = 0; i < lines; i++) {
    console.log('');
  }
};

cli.horizontalLine = function () {
  const width = process.stdout.columns;
  let line = '';
  for (let i = 0; i < width; i++) {
    line += '-';
  }
  console.log(line);
};

cli.centered = function (str) {
  str = typeof str === 'string' && str.trim().length > 0 ? str.trim() : '';
  const width = process.stdout.columns;
  const leftPadding = Math.floor((width - str.length) / 2);
  let line = '';
  for (let i = 0; i < leftPadding; i++) {
    line += ' ';
  }
  line += str;
  console.log(line);
};

cli.responders.help = function () {
  const commands = {
    exit: 'Kill the CLI (and the rest of the application)',
    man: 'Show this help page',
    help: "Alias of the 'man' command",
    stats:
      'Get statistics on the underlying operating system and resource utilization',
    'list users':
      'Show a list of all the registered (undeleted) users in the system',
    'more user info --{userId}': 'Show details of a specific user',
    'list checks --up --down':
      'Show a list of all the active checks in the system, including their state. the --up nad -- down flags are both optional',
    'more check info --{checkId}': 'Show details of a specific check',
    'list logs':
      'Show a list of all the log files availavle to be read (compressed only)',
    'more log info --{fileName}': 'Show details of a specific log file',
  };

  cli.horizontalLine();
  cli.centered('CLI MANUAL');
  cli.horizontalLine();
  cli.verticalSpace(2);

  for (const key in commands) {
    if (commands.hasOwnProperty(key)) {
      const value = commands[key];
      let line = '\x1b[34m' + key + '\x1b[0m';
      const padding = 60 - line.length;
      for (let i = 0; i < padding; i++) {
        line += ' ';
      }
      line += value;
      console.log(line);
      cli.verticalSpace();
    }
  }
  cli.verticalSpace(1);
  cli.horizontalLine();
};
cli.responders.exit = function () {
  process.exit(0);
};
cli.responders.stats = function () {
  const stats = {
    'Load Average': os.loadavg().join(' '),
    'CPU Count': os.cpus().length,
    'Free Memory': os.freemem(),
    'Current Malloced Memory': v8.getHeapStatistics().malloced_memory,
    'Peak Malloced Memory': v8.getHeapStatistics().peak_malloced_memory,
    'Allocated Heap Used (%)': Math.round(
      (v8.getHeapStatistics().used_heap_size /
        v8.getHeapStatistics().total_heap_size) *
        100
    ),
    'Available Heap Allocated (%)': Math.round(
      (v8.getHeapStatistics().total_heap_size /
        v8.getHeapStatistics().heap_size_limit) *
        100
    ),
    Uptime: os.uptime() + ' Seconds',
  };

  cli.horizontalLine();
  cli.centered('SYSTEM STATISTICS');
  cli.horizontalLine();
  cli.verticalSpace(2);

  for (const key in stats) {
    if (stats.hasOwnProperty(key)) {
      const value = stats[key];
      let line = '\x1b[34m' + key + '\x1b[0m';
      const padding = 60 - line.length;
      for (let i = 0; i < padding; i++) {
        line += ' ';
      }
      line += value;
      console.log(line);
      cli.verticalSpace();
    }
  }
  cli.verticalSpace(1);
  cli.horizontalLine();
};
cli.responders.listUsers = function () {
  _data.list('users', function (err, userIds) {
    if (!err && userIds && userIds.length > 0) {
      cli.verticalSpace();
      userIds.forEach(function (userId) {
        _data.read('users', userId, function (err, userData) {
          if (!err && userData) {
            let line = `Name: ${userData.firstName} ${userData.lastName}, Phone: ${userData.phone}, Checks: `;
            const numChecks =
              typeof userData.checks === 'object' &&
              userData.checks instanceof Array &&
              userData.checks.length > 0
                ? userData.checks.length
                : 0;
            line += numChecks;
            console.log(line);
            cli.verticalSpace();
          }
        });
      });
    }
  });
};
cli.responders.moreUserInfo = function (str) {
  const id = str.split('--')[1].trim() || false;
  if (id) {
    _data.read('users', id, function (err, userData) {
      if (!err && userData) {
        delete userData.password;

        cli.verticalSpace();
        console.dir(userData, { colors: true });
        cli.verticalSpace();
      }
    });
  }
};
cli.responders.listChecks = function (str) {
  _data.list('checks', function (err, checkIds) {
    if (!err && checkIds && checkIds.length > 0) {
      cli.verticalSpace();
      checkIds.forEach(function (checkId) {
        _data.read('checks', checkId, function (err, checkData) {
          const includeCheck = false;
          const lowerString = str.toLowerCase();

          const state =
            typeof checkData.state === 'string' ? checkData.state : 'down';
          const stateOrUnknown =
            typeof checkData.state === 'string' ? checkData.state : 'unknown';
          if (
            lowerString.indexOf('--' + state) > -1 ||
            (lowerString.indexOf('--down') === -1 &&
              lowerString.indexOf('--up') === -1)
          ) {
            const line = `ID: ${
              checkData.id
            } ${checkData.method.toUpperCase()} ${checkData.protocol}://${
              checkData.url
            }, State: ${stateOrUnknown}`;
            console.log(line);
            cli.verticalSpace();
          }
        });
      });
    }
  });
};
cli.responders.moreCheckInfo = function (str) {
  const id = str.split('--')[1].trim() || false;
  if (id) {
    _data.read('checks', id, function (err, checkData) {
      if (!err && checkData) {
        delete checkData.password;

        cli.verticalSpace();
        console.dir(checkData, { colors: true });
        cli.verticalSpace();
      }
    });
  }
};
cli.responders.listLogs = function () {
  const ls = childProcess.spawn('ls', ['./.logs']);
  ls.stdout.on('data', function (dataObj) {
    const dataStr = dataObj.toString();
    const logFileNames = dataStr.split('\n');
    cli.verticalSpace();
    logFileNames.forEach(function (logFileName) {
      if (
        typeof logFileName === 'string' &&
        logFileName.length > 0 &&
        logFileName.indexOf('-') > -1
      ) {
        console.log(logFileName.trim().split('.')[0]);
        cli.verticalSpace();
      }
    });
  });
};
cli.responders.moreLogInfo = function (str) {
  const id = str.split('--')[1].trim() || false;
  if (id) {
    cli.verticalSpace();
    _logs.decompress(id, function (err, strData) {
      if (!err && strData) {
        const arr = strData.split('\n');
        arr.forEach(function (jsonString) {
          const logObject = helpers.parseJsonToObject(jsonString);
          if (logObject && JSON.stringify(logObject) !== '{}') {
            console.dir(logObject, { colors: true });
            cli.verticalSpace();
          }
        });
      }
    });
  }
};

cli.processInput = function (str) {
  str = typeof str === 'string' && str.trim().length > 0 ? str.trim() : false;
  if (str) {
    const uniqueInputs = [
      'man',
      'help',
      'exit',
      'stats',
      'list users',
      'more user info',
      'list checks',
      'more check info',
      'list logs',
      'more log info',
    ];

    let matchFound = false;
    let counter = 0;

    uniqueInputs.some(function (input) {
      if (str.toLowerCase().indexOf(input) > -1) {
        matchFound = true;

        e.emit(input, str);
        return true;
      }
    });

    if (!matchFound) {
      console.log('Sorry, try again.');
    }
  }
};

cli.init = function () {
  console.log('\x1b[34m%s\x1b[0m', `The CLI is running`);

  const _interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '',
  });

  _interface.prompt();

  _interface.on('line', function (str) {
    cli.processInput(str);

    _interface.prompt();
  });

  _interface.on('close', function () {
    process.exit(0);
  });
};

module.exports = cli;
