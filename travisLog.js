#!/usr/bin/env node

const { spawn } = require('child_process')

let stdout = Buffer.alloc(0)
let stderr = Buffer.alloc(0)

const proc = spawn(process.argv[2], process.argv.slice(3))

proc.stdout.on('data', (d) => {
  const MAKE_REGEXP = /^make\[[12]\].*$/gm
  const dataStr = d.toString('utf8')
  let match
  while( (match = MAKE_REGEXP.exec(dataStr)) != null) console.log(match[0])
  stdout = Buffer.concat([ stdout, d ])
  stdout = stdout.slice(Math.max(stdout.length - 5e5, 0))
})
proc.stderr.on('data', (d) => {
  stderr = Buffer.concat([ stderr, d ])
  stderr = stderr.slice(Math.max(stderr.length - 5e5, 0))
})

process.on('beforeExit', () => {
  console.error(stderr.slice(Math.max(stderr.length - 5e5, 0)).toString('utf8'))
  console.log(stdout.slice(Math.max(stdout.length - 5e5, 0)).toString('utf8'))
  stdout = stderr = Buffer.alloc(0)
})

proc.on('close', (code) => process.exitCode = code)

Array('SIGINT', 'SIGTERM').forEach( (sig) => process.on(sig, () => proc.kill(sig)))

!function stillRunning() {
  console.log('Build running...')
  setTimeout(stillRunning, 30e3).unref()
}()

setTimeout(function abort() {
  proc.kill('SIGTERM')
  setTimeout( () => proc.kill('SIGKILL'), 5e3 ).unref()
}, 120 * 60e3).unref()
