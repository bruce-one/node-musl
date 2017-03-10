{
  "targets": [
    {
      "target_name": "node-musl",
      "type": "none",
      "actions": [
        {
          "action_name": "Build bootstrap",
          "inputs": [ "src/" ],
          "outputs": [ "bootstrap" ],
          "message": "Building bootstrap for rebuilding",
          "action": [ "eval", "cd src/ && node ../generateBootstrapConfig.js <(target_arch) > config.mak && make clean && MAKEFLAGS=-w make -j<!@(node -p 'process.env.CI ? 1 : (os.cpus().length + 1)') && make install" ]
        },
        {
          "action_name": "Build static toolchain",
          "inputs": [ "src/" ],
          "outputs": [ "<(target_arch)-linux-musl" ],
          "message": "Building musl",
          "action": [ "eval", "cd src/ && node ../generateConfig.js <(target_arch) > config.mak && make clean && MAKEFLAGS=-w make -j<!@(node -p 'process.env.CI ? 1 : (os.cpus().length + 1)') && make install && cd .. && node hardlinks.js <(target_arch) && touch <(target_arch)-linux-musl/node_musl.node" ]
        }
      ]
    }
  ]
}
