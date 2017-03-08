#!/usr/bin/env node

// converts hardlinks to symlinks, because node-pre-gyp (by virtue of it's tar module/impl) doesn't handle them well

const { unlinkSync, symlinkSync } = require('fs')
const { join, relative, dirname } = require('path')

const klawSync = require('klaw-sync')

const paths = klawSync(`${process.arch}-linux-musl`, { nodir: true })

const byIno = paths.reduce( (possibleDups, f) => {
    const arr = possibleDups[f.stats.ino] || []
    possibleDups[f.stats.ino] = arr.concat(f)
    return possibleDups
  }, Object.create(null))

const dupInos = Object.keys(byIno).filter( (k) => byIno[k].length > 1)

dupInos.forEach( (ino) => {
  const [ target, ...rest ] = byIno[ino].map( ({ path }) => path)
  rest.forEach( (path) => {
    unlinkSync(path)
    symlinkSync(relative(dirname(path), target), path)
  })
})
