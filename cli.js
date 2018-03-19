#! /usr/bin/env node

require('yargs')
  .env('BLEZER')
  .version()
  .usage('Usage: blezer <command> [options]')
  .command(['start', 's'], 'Start', require('./lib/start'))
  .command(['create <name>', 'c'], 'Create', require('./cli/create'))
  .help('h')
  .alias('h', 'help')
  .epilogue('for more information, find the documentation at https://github.com/bloom-tech/blezer')
  .argv;
