#!/usr/bin/env node

// converts hardlinks to symlinks, because node-pre-gyp (by virtue of it's tar module/impl) doesn't handle them well

const debug = require('debug')('node-musl')
const { unlinkSync, symlinkSync } = require('fs')
const { join, relative, dirname } = require('path')

const klawSync = require('klaw-sync')

const arch = process.argv[2] || path.basename(binding_path).split('-')[0]

const paths = klawSync(`${arch}-linux-musl`, { nodir: true })

const byIno = paths.reduce( (possibleDups, f) => {
    const arr = possibleDups[f.stats.ino] || []
    possibleDups[f.stats.ino] = arr.concat(f)
    return possibleDups
  }, Object.create(null))

const dupInos = Object.keys(byIno).filter( (k) => byIno[k].length > 1)

debug('found "%s" inodes with multiple references', dupInos.length)

dupInos.forEach( (ino) => {
  const [ target, ...rest ] = byIno[ino].map( ({ path }) => path)
  rest.forEach( (path) => {
    unlinkSync(path)
    const relativeTarget = relative(dirname(path), target)
    symlinkSync(relativeTarget, path)
    debug('replacing hardlink "%s" with symlink targeting "%s"', path, relativeTarget)
  })
})
