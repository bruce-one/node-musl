#!/usr/bin/env node

const debug = require('debug')('node-musl')
const { join } = require('path')
const { fork, spawnSync, execFileSync } = require('child_process')
const { unlinkSync } = require('fs')
const assert = require('assert')

const bin = join(__dirname, 'hello.out')

const proc = fork(join(__dirname, '..'), [ '-v', '-static', join(__dirname, 'hello.c'), '-o', bin ], { cwd: __dirname })

process.on('unhandledRejection', (err) => { throw err })

new Promise( function testGcc(resolve) {
  proc.on('exit', (code) => {
    debug('hello.c compile exit code was "%s"', code)
    checkBinary()
    resolve()
  })
})
.then( () => {
  const stdout = execFileSync(
    join(__dirname, '..', 'bin', 'env.js')
    , [ 'sh', '-c', 'echo -n CC=$CC CXX=$CXX LD=$LD' ]
    , { env: Object.assign({}, process.env, { CC: 'fail', CXX: 'fail', LD: 'fail' }), encoding: 'utf8' })
  debug('env command stdout "%s"', stdout)
  assert.equal(/CC=/i.test(stdout), true, 'has CC')
  assert.equal(/CC=(\s|fail)/i.test(stdout), false, 'set CC')
  assert.equal(/CXX=(\s|fail)/i.test(stdout), false, 'set CXX')
  assert.equal(/LD=(\s|fail)/i.test(stdout), false, 'set LD')
})
.then( () => {
  const stdout = execFileSync(
    'sh'
    , [ '-c', `eval $(${join(__dirname, '..', 'bin', 'exports.js')}); echo -n CC=$CC CXX=$CXX LD=$LD` ]
    , { env: Object.assign({}, process.env, { CC: 'fail', CXX: 'fail', LD: 'fail' }), encoding: 'utf8' })
  debug('exports command stdout "%s"', stdout)
  assert.equal(/CC=/i.test(stdout), true, 'has CC')
  assert.equal(/CC=(\s|fail)/i.test(stdout), false, 'set CC')
  assert.equal(/CXX=(\s|fail)/i.test(stdout), false, 'set CXX')
  assert.equal(/LD=(\s|fail)/i.test(stdout), false, 'set LD')
})
.then( () => {
  const env = Object.assign({}, process.env)
  require('..').setExports()
  assert.equal(/gcc$/i.test(process.env.CC), true, 'set CC')
  assert.equal(/g\+\+$/i.test(process.env.CXX), true, 'set CXX')
  assert.equal(/ld$/i.test(process.env.LD), true, 'set LD')
  Object.keys(process.env).forEach( (k) => env[k] ? process.env[k] = env[k] : delete process.env[k])
})
.then( () => console.log('All tests passed.'))

function checkBinary() {
  const hProc = spawnSync(bin)
  assert.equal(hProc.status, 0, 'exit success')
  assert.equal(hProc.stdout.toString('utf8'), 'hello', 'stdout is correct')
  unlinkSync(bin)
}
