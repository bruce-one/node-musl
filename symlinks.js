'use strict'

const debug = require('debug')('node-musl')
const path = require('path')
const fs = require('fs')

const mapping = require('./mapping')
const muslArch = process.argv[2] || mapping[mapping.getName()]

const binding_path = path.join(__dirname, muslArch)

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
