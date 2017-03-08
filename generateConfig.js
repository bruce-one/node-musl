const path = require('path')

const target = process.argv[2]

console.log(`
TARGET=${target}
OUTPUT=${path.resolve(__dirname, target)}
DL_CMD=${path.resolve(__dirname, 'download.js')}

# COMMON_CONFIG += CC="${path.resolve(__dirname, 'bootstrap/bin/x86_64-linux-musl-gcc')}" CXX="${path.resolve(__dirname, 'bootstrap/bin/x86_64-linux-musl-g++')}" LD="${path.resolve(__dirname, 'bootstrap/bin/x86_64-linux-musl-ld')}"
COMMON_CONFIG += CFLAGS="-v -g0 -Os -static --static" CXXFLAGS="-v -g0 -Os -static --static" LDFLAGS="-s -static"
COMMON_CONFIG += --disable-nls
GCC_CONFIG += --enable-languages=c,c++
GCC_CONFIG += --disable-libquadmath --disable-decimal-float
`)
