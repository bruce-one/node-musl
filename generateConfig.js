const path = require('path')

const mapping = require('./mapping')
const arch = process.argv[2] || mapping.getName()
const muslArch = mapping[arch]

console.log(`
TARGET=${muslArch}
OUTPUT=${path.resolve(__dirname, arch)}
DL_CMD=${path.resolve(__dirname, 'download.js')}

COMMON_CONFIG += CC="${path.resolve(__dirname, `bootstrap/bin/${muslArch}-gcc`)} -static --static" CXX="${path.resolve(__dirname, `bootstrap/bin/${muslArch}-g++`)} -static --static" LD="${path.resolve(__dirname, `bootstrap/bin/${muslArch}-ld`)} -static"
COMMON_CONFIG += CFLAGS="-g0 -Os" CXXFLAGS="-g0 -Os" LDFLAGS="-s"
COMMON_CONFIG += --disable-nls
GCC_CONFIG += --enable-languages=c,c++ --enable-default-pie --enable-lto
GCC_CONFIG += --disable-libquadmath --disable-decimal-float
`)
