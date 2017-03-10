#!/usr/bin/env node

const debug = require('debug')('node-musl')
const { spawn } = require('child_process')

let stdout = Buffer.alloc(0)
let stderr = Buffer.alloc(0)

const proc = spawn(process.argv[2], process.argv.slice(3))

proc.stdout.on('data', (d) => {
  const MAKE_REGEXP = /^make\[[\d]\].*$/gm
  const dataStr = d.toString('utf8')
  let match
  while( (match = MAKE_REGEXP.exec(dataStr)) != null) console.log(match[0])
  stdout = Buffer.concat([ stdout, d ])
  stdout = stdout.slice(Math.max(stdout.length - 1e4, 0))
})
proc.stderr.on('data', (d) => {
  stderr = Buffer.concat([ stderr, d ])
  stderr = stderr.slice(Math.max(stderr.length - 2e4, 0))
})

process.on('beforeExit', () => {
  console.error(stderr.slice(Math.max(stderr.length - 1e4, 0)).toString('utf8'))
  console.log(stdout.slice(Math.max(stdout.length - 2e4, 0)).toString('utf8'))
  stdout = stderr = Buffer.alloc(0)
})

proc.on('exit', (code, sig) => {
  debug('Build process has exited. The exit code is "%s" and the signal is "%s".', code, sig)
  process.exitCode = code != null ? code : (sig ? 1 : 0)
})

Array('SIGINT', 'SIGTERM').forEach( (sig) => process.on(sig, () => {
  debug('Build process got signal "%s".', sig)
  process.exitCode = 1 // assumes failure; this will likely be overridden in `proc.on('exit'...`
  proc.kill(sig)
}))

!function stillRunning() {
  console.log('Build running...')
  setTimeout(stillRunning, 30e3).unref()
}()

setTimeout(function abort() {
  debug('Build process timed out.')
  process.exitCode = 1 // assumes failure; this will likely be overridden in `proc.on('exit'...`
  proc.kill('SIGTERM')
  setTimeout( () => proc.kill('SIGKILL'), 5e3 ).unref()
}, 180 * 60e3).unref()
