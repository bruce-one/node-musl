#!/usr/bin/env node

const path = require('path')
const { spawnSync } = require('child_process')

const { CC, CXX, LD } = require('./exports')

spawnSync('env', [ `CC=${CC}`, `CXX=${CXX}`, `LD=${LD}` ].concat(process.argv.slice(2)), { stdio: 'inherit' })
