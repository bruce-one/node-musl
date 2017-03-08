#!/usr/bin/env node

const { join } = require('path')
const { execFileSync } = require('child_process')
const packageJson = require('./package.json')

module.exports.wrap = wrap
function wrap(cmd) {
  return function wrapSync(args, opts = { stdio: 'inherit' }) {
    return execFileSync(join(__dirname, packageJson.bin[`musl-${cmd}`]), args, opts)
  }
}

const gccWrapSync = module.exports.gccWrapSync = wrap('gcc')

module.exports.gxxWrapSync = wrap('g++')

if(require.main === module) {
  gccWrapSync(process.argv.slice(2))
}
