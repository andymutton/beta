'use strict';

const Ana = require('./ana_log');
const Bower = require('./bower');
const parseCommandLine = require('command-line-args')

process.on('uncaughtException', function(err) {
  // At least log uncaught exceptions...
  Ana.fail("main/uncaughtException", err);
  Ana.log("main/uncaughtException %s", err);
});

process.on('unhandledRejection', function(err) {
  // At least log uncaught exceptions...
  Ana.fail("main/unhandledRejection", err);
  Ana.log("main/unhandledRejection %s", err);
});


const args = parseCommandLine([
  { name: 'owner', type: String, multiple: false },
  { name: 'repo', type: String, multiple: false },
  { name: 'versionOrSha', type: String, multiple: false }
]);

Ana.enableDebug();
Ana.log("main/processTasks", "Debug mode - logging catalog responses to console.");

var bower = new Bower();
Ana.newBuffer();

bower.prune().then(() => {
  return bower.install(args.owner, args.repo, args.versionOrSha);
}).then(mainHtmlPaths => {
  return bower.findDependencies(args.owner, args.repo, args.versionOrSha);
}).then(results => {
  Ana.log(results);
}).catch(Ana.log);