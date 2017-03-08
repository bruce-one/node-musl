#!/usr/bin/env node
'use strict'

const http = require('http')
const https = require('https')
const fs = require('fs')
const url = require('url')

const dest = process.argv[2]
const source = process.argv[3]

new Promise( (resolve) => {
  fs.stat(dest, (err, stat) => {
    if(err || !stat.isFile()) return resolve()
    resolve(stat.size)
  })
})
.then( (size) => {
  const parsedUrl = url.parse(source)
  const get = url.parse(source).protocol === 'https:' ? https.get : http.get
  get(Object.assign({}, parsedUrl, size ? { headers: { range: `bytes=${size}-` } } : null), (res) => {
    let start = false
    if(res.statusCode === 206) {
      try {
        start = parseInt(res.headers['content-range'].split(' ')[1].split('-')[0])
      } catch(e) {}
    }
    const ws = fs.createWriteStream(dest, start ? { start, flags: 'a' } : {})
    res.pipe(ws)
  })
})
