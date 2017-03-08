#!/usr/bin/env node

const { gccWrapSync } = require('..')

process.exitCode = gccWrapSync(process.argv.slice(2)).status
