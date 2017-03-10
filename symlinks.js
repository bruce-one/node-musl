'use strict'

const debug = require('debug')('node-musl')
const path = require('path')
const fs = require('fs')

const arch = process.argv[2] || process.arch

const binary = require('node-pre-gyp')
const binding_path = path.resolve(binary.find(path.resolve(path.join(__dirname,'./package.json')), { target_arch: arch }), '..')

const muslArch = arch === 'x64' ? 'x86_64' : (arch === 'ia32' ? 'i686' : arch)

Array('gcc', 'g++', 'ld').forEach( (bin) => {
  const binPath = path.join(__dirname, 'bin', `musl-${bin}`)
  const target = path.relative(path.join(__dirname, 'bin'), path.join(binding_path, 'bin', `${muslArch}-linux-musl-${bin}`))
  fs.unlink(binPath, () => {
    fs.symlink(target, binPath, (err) => {
      debug('symlink "%s" created targeting "%s"', binPath, target)
      if(err) throw err
    })
  })
})
