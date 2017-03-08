'use strict'

const path = require('path')
const fs = require('fs')

const binary = require('node-pre-gyp')
const binding_path = path.resolve(binary.find(path.resolve(path.join(__dirname,'./package.json'))), '..')

Array('gcc', 'g++', 'ld').forEach( (bin) => {
  const binPath = path.join(__dirname, 'bin', `musl-${bin}`)
  const target = path.relative(path.join(__dirname, 'bin'), path.join(binding_path, 'bin', `x86_64-linux-musl-${bin}`))
  fs.unlink(binPath, () => {
    fs.symlink(target, binPath, (err) => {
      if(err) throw err
    })
  })
})
