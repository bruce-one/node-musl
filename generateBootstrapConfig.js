const path = require('path')

const muslArch = process.arch === 'x64' ? 'x86_64' : process.arch

const target = `${muslArch}-linux-musl`

console.log(`
TARGET=${target}
OUTPUT=${path.resolve(__dirname, 'bootstrap')}
DL_CMD=${path.resolve(__dirname, 'download.js')}

COMMON_CONFIG += CFLAGS="-g0 -Os" CXXFLAGS="-g0 -Os" LDFLAGS="-s"
COMMON_CONFIG += --disable-nls
GCC_CONFIG += --enable-languages=c,c++
GCC_CONFIG += --disable-libquadmath --disable-decimal-float
`)
