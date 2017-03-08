#!/usr/bin/env node

const { gxxWrapSync } = require('..')

process.exitCode = gxxWrapSync(process.argv.slice(2)).status
