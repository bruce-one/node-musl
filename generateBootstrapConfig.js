const path = require('path')

const arch = process.argv[2] || process.arch
const muslArch = arch === 'x64' ? 'x86_64' : (arch === 'ia32' ? 'i686' : arch)

const target = `${muslArch}-linux-musl`

console.log(`
TARGET=${target}
OUTPUT=${path.resolve(__dirname, 'bootstrap')}
DL_CMD=${path.resolve(__dirname, 'download.js')}

COMMON_CONFIG += CFLAGS="-g0 -Os" CXXFLAGS="-g0 -Os" LDFLAGS="-s"
COMMON_CONFIG += --disable-nls
GCC_CONFIG += --enable-languages=c,c++ --enable-default-pie --enable-lto
GCC_CONFIG += --disable-libquadmath --disable-decimal-float
`)
