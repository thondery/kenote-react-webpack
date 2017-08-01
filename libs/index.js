const inquirer = require('inquirer')
const path = require('path')
const os = require('os')
const base = require('./base')

exports.create = (dir) => {
  console.log(base.__BASEDIR)
  let questions = [
    {
      type: 'input',
      name: 'name',
      message: 'name:',
      default: base.getBaseName(dir)
    },
    {
      type: 'input',
      name: 'version',
      message: 'version:',
      default: '1.0.0'
    },
    {
      type: 'input',
      name: 'description',
      message: 'description:',
      default: 'This is a React Project.'
    },
    {
      type: 'input',
      name: 'author',
      message: 'author:'
    },
    {
      type: 'input',
      name: 'license',
      message: 'license:',
      default: 'MIT'
    }
  ]
  return inquirer.prompt(questions)
    .then( answers => {
      base._createApp(dir, answers)
    })
}