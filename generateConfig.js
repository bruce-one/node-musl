const path = require('path')

const arch = process.argv[2] || process.arch
const muslArch = arch === 'x64' ? 'x86_64' : (arch === 'ia32' ? 'i686' : arch)

const target = `${muslArch}-linux-musl`

console.log(`
TARGET=${target}
OUTPUT=${path.resolve(__dirname, `${process.arch}-linux-musl`)}
DL_CMD=${path.resolve(__dirname, 'download.js')}

COMMON_CONFIG += CC="${path.resolve(__dirname, 'bootstrap/bin/${muslArch}-linux-musl-gcc')}" CXX="${path.resolve(__dirname, 'bootstrap/bin/${muslArch}-linux-musl-g++')}" LD="${path.resolve(__dirname, 'bootstrap/bin/${muslArch}-linux-musl-ld')}"
COMMON_CONFIG += CFLAGS="-g0 -Os -static --static" CXXFLAGS="-g0 -Os -static --static" LDFLAGS="-s -static"
COMMON_CONFIG += --disable-nls
GCC_CONFIG += --enable-languages=c,c++
GCC_CONFIG += --disable-libquadmath --disable-decimal-float
`)
