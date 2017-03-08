#!/usr/bin/env node

// TODO function to export CC

const { join } = require('path')
const { spawnSync } = require('child_process')
const packageJson = require('./package.json')

module.exports.wrap = wrap
function wrap(cmd) {
  return function wrapSync(args, opts = { stdio: 'inherit' }) {
    return spawnSync(join(__dirname, packageJson.bin[`musl-${cmd}`]), args, opts)
  }
}

const gccWrapSync = module.exports.gccWrapSync = wrap('gcc')

module.exports.gxxWrapSync = wrap('g++')

if(require.main === module) {
  process.exitCode = gccWrapSync(process.argv.slice(2)).status
}
