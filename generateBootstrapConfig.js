const path = require('path')

const mapping = require('./mapping')
const arch = process.argv[2] || mapping.getName()
const muslArch = mapping[arch]

console.log(`
TARGET=${muslArch}
OUTPUT=${path.resolve(__dirname, 'bootstrap')}
DL_CMD=${path.resolve(__dirname, 'download.js')}

COMMON_CONFIG += CFLAGS="-g0 -Os" CXXFLAGS="-g0 -Os" LDFLAGS="-s"
COMMON_CONFIG += --disable-nls
GCC_CONFIG += --enable-languages=c,c++ --enable-default-pie --enable-lto
GCC_CONFIG += --disable-libquadmath --disable-decimal-float
`)
