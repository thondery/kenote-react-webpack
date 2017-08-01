const program = require('commander')
const inquirer = require('inquirer')
const _ = require('lodash')
const krw = require('./libs')
const pkg = require('./package.json')
const version = pkg.version

program
  .version(version)

program
  .usage('[command] [options]')

program
  .command('init [dir]')
  .usage('[dir]')
  .description('Initialize a project for React')
  .action( dir => krw.create(dir) )


// Parse and fallback to help if no args
if (_.isEmpty(program.parse(process.argv).args) && process.argv.length === 2) {
  program.help()
}