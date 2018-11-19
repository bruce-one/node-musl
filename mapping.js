module.exports = new Proxy({
  x64: 'x86_64-linux-musl',
  ia32: 'i686-linux-musl',
  arm: 'arm-linux-musleabi',
  arm32v6: 'arm-linux-musleabi',
  arm32v7: 'arm-linux-musleabi',
  armhf: 'arm-linux-musleabihf',
  arm32v6hf: 'arm-linux-musleabihf',
  arm32v7hf: 'arm-linux-musleabihf',
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
    const arm = `arm32v${process.config.variables.arm_version}`
    if(process.config.variables.arm_float_abi === 'hard') return `${arm}hf`
    return arm
  }
  return process.arch
}

// TODO not necessarily an arch?
function throwUnsupported(arch) {
  throw new Error(`Unsupported arch: ${arch}`)
}

if(require.main === module) process.stdout.write(module.exports.getName())
