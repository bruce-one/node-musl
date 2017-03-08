{
  "targets": [
    {
      "target_name": "node-musl",
      "type": "none",
      "actions": [
        {
          "action_name": "Build bootstrap",
          "inputs": [ "src/" ],
          "outputs": [ "src/bootstrap" ],
          "message": "Building bootstrap for rebuilding",
          "action": [ "eval", "cd src/ && node ../generateBootstrapConfig.js x86_64-linux-musl > config.mak && make clean && MAKEFLAGS=-w make -j<!@(node -p 'os.cpus().length + 1') && make install" ]
        },
        {
          "action_name": "Build x86_64",
          "inputs": [ "src/" ],
          "outputs": [ "src/x86_64-linux-musl" ],
          "message": "Building x86_64 musl",
          "action": [ "eval", "cd src/ && node ../generateConfig.js x86_64-linux-musl > config.mak && make clean && MAKEFLAGS=-w make -j<!@(node -p 'os.cpus().length + 1') && make install && touch ../x86_64-linux-musl/node_musl.node" ]
        }
      ]
    }
  ]
}
