const fs = require('fs-extra')
const chalk = require('chalk')
const inquirer = require('inquirer')
const path = require('path')
const _ = require('lodash')
const settingFile = path.resolve(__dirname, '../', 'setting.json')
const os = require('os')
const pattern = os.platform() === 'win32' ? /^([a-zA-Z]{1}\:\\)/ : /^(\/{1})/
const success = chalk.green.bold
const failure = chalk.red.bold
const warning = chalk.yellow.bold

const styles = {
  ['success']: success,
  ['failure']: failure,
  ['warning']: warning
}

// 当前路径
exports.__BASEDIR = process.cwd()

// 获取当前目录名
exports.getBaseName = (destination = this.__BASEDIR) => destination.replace(/(.*\/)*([^.]+)/ig, '$2')


// 获取目标路径
exports.getTargetInfo = (target) => {
  const dir = pattern.test(target) ? target : path.resolve(this.__BASEDIR, target.replace(/\s/g, '_'))
  const exists = fs.existsSync(dir)
  let empty = true
  let message = null
  let failure = null
  if (exports) {
    try {
      empty = fs.readdirSync(dir).length === 0
      //if (!empty) message = 'A destination is not an empty directory.'
    } catch (error) {
      //empty = false
      failure = 'A destination is not a directory.'
    }
  }
  return { dir, exists, empty, failure }
}

// message
exports.message = (msg, type) => console.log(styles[type]('\n  %s\n'), msg)
exports.success = (msg) => this.message(msg, 'success')
exports.failure = (msg) => this.message(msg, 'failure')
exports.warning = (msg) => this.message(msg, 'warning')

// 创建Base工程
exports.createApp = (destination) => {
  const name = destination.replace(/(.*\/)*([^.]+)/ig, '$2')
  const tplDir = this.getTemplate('base')
  if (!tplDir) return
  fs.copy(tplDir, destination)
    .then( () => {
      let pkg = fs.readFileSync(path.resolve(destination, 'package.json'), 'utf-8')
      let data = _.assign(JSON.parse(pkg), {
        name: name,
        description: 'This is a React Project.',
        repository: undefined,
        author: undefined
      })
      this.writeJsonFile(path.resolve(destination, 'package.json'), data)
      this.success(`success OK!===
      1. cd ${destination}
      `)
    })
}

exports._createApp = (dir, options) => {
  const target = this.getTargetInfo(dir || this.__BASEDIR)
  if (target.exists) {
    if (target.failure) return this.message(target.failure, 'failure')
    if (!target.empty) {
      let questions = [
        {
          type: 'confirm',
          name: 'create_app',
          message: 'Content already exists, whether or not to overwrite?',
          default: false
        }
      ]
      return inquirer.prompt(questions)
        .then( answers => {
          answers['create_app'] && _createApp(target.dir, options)
        })
    }
  }
  _createApp(target.dir, options)
}

const _createApp = (destination, options) => {
  const tplDir = this.getTemplate('base')
  if (!tplDir) return
  fs.copy(tplDir, destination)
    .then( () => {
      let pkg = fs.readFileSync(path.resolve(destination, 'package.json'), 'utf-8')
      let data = _.assign(JSON.parse(pkg), { repository: undefined }, options)
      this.writeJsonFile(path.resolve(destination, 'package.json'), data)
      this.success(`success OK!`)
    })
}

// 获取模版
exports.getTemplate = (name) => {
  const tplDir = path.resolve(__dirname, '../tpl', name)
  if (!fs.existsSync(tplDir)) 
    return this.message('The template does not exist.', 'failure')
  try {
    if (fs.readdirSync(tplDir).length === 0)
      return this.message('The template does not exist.', 'failure')
    return tplDir
  } catch (error) {
    return this.message('The template does not exist.', 'failure')
  }
}

// 获取配置
exports.getSetting = () => {
  try {
    const setting = fs.readFileSync(settingFile, 'utf-8')
    return JSON.parse(setting)
  } catch (error) {
    return null
  }
}

// 保存配置
exports.saveSetting = (data) => {
  const setting = this.getSetting()
  this.writeJsonFile(settingFile, _.assign(setting, data))
}

// 写入JSON文件
exports.writeJsonFile = (file, data) => {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8')
}

// 