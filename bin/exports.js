#!/usr/bin/env node

const path = require('path')

const CC = module.exports.CC = path.join(__dirname, 'musl-gcc')
const CXX = module.exports.CXX = path.join(__dirname, 'musl-g++')
const LD = module.exports.LD = path.join(__dirname, 'musl-ld')

if(require.main === module) {
  console.log(`
    export CC='${CC}'
    export CXX='${CXX}'
    export LD='${LD}'
  `.replace(/^ +|^\n/gm, ''))
}
