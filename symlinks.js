const path = require('path')
const fs = require('fs')

Array('gcc', 'g++', 'ld').forEach( (bin) => {
  const binPath = path.join(__dirname, 'bin', `musl-${bin}`)
  const target = path.relative(path.join(__dirname, 'bin'), path.join(__dirname, 'x86_64-linux-musl', 'bin', `x86_64-linux-musl-${bin}`))
  fs.unlink(binPath, () => {
    fs.symlink(target, binPath, (err) => {
      if(err) throw err
    })
  })
})
