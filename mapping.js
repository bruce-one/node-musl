module.exports = new Proxy({
  x64: 'x86_64-linux-musl',
  ia32: 'i686-linux-musl',
  arm: 'arm-linux-musleabi',
  armhf: 'arm-linux-musleabihf',
  arm64: 'aarch64-linux-musl',
}, {
  get: (obj, prop) => {
    return prop in obj
      ? obj[prop]
      : throwUnsupported(prop)
  }
})
module.exports.getName = () => {
  if(process.arch === 'arm') {
    if(process.config.variables.arm_float_abi === 'hard') return 'armhf'
    return 'arm'
  }
  return process.arch
}

// TODO not necessarily an arch?
function throwUnsupported(arch) {
  throw new Error(`Unsupported arch: ${arch}`)
}

if(require.main === module) process.stdout.write(module.exports[module.exports.getName()])
