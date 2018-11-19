'use strict'

const debug = require('debug')('node-musl')
const path = require('path')
const fs = require('fs')

const mapping = require('./mapping')
const arch = process.env.BUILD_ARCH || mapping.getName()
const muslArch = mapping[arch]

const binding_path = path.join(__dirname, arch)

Array('gcc', 'g++', 'ld').forEach( (bin) => {
  const binPath = path.join(__dirname, 'bin', `musl-${bin}`)
  const target = path.relative(path.join(__dirname, 'bin'), path.join(binding_path, 'bin', `${muslArch}-${bin}`))
  fs.unlink(binPath, () => {
    fs.symlink(target, binPath, (err) => {
      debug('symlink "%s" created targeting "%s"', binPath, target)
      if(err) throw err
    })
  })
})
