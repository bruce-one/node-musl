Node-Musl
=========

Uses [richfelker/musl-cross-make](https://github.com/richfelker/musl-cross-make)
and node-gyp to create a statically linked musl GCC toolchain.

This toolchain can then be used to create properly statically linked binary for
Linux. For example, a fully statically linked version of node can created using
this toolchain.

Simple static node build example, assuming you already have another version of
node installed.

    cd node
    make clean
    npm i node-musl # takes a long time...
    $(npm bin)/musl-env ./configure --fully-static # musl-env sets CC, CXX, LD
    $(npm bin)/musl-env make -j$(node -p 'os.cpus().length + 1')
    file ./out/Release/node
    strip --strip-all ./out/Release/node

    # eval "$("$(npm bin)/musl-exports")" # sets CC CXX and LD in the shell

Note: Using `--fully-static` (as shown above) will disable dlopen which prevents
Node from loading any native modules, using `--partly-static` is the recommended
alternative if you still want dlopen (because otherwise there are issues with
libgcc).

Native Modules
==============

An example of building node with node-musl and using a native module (sqlite3)
is:

    npm i node-musl

    mkdir node; cd node
    curl -L https://nodejs.org/dist/node-latest.tar.gz | tar xvz --strip-components=1
    eval "$("$(npm bin)/musl-exports")"
    ./configure --partly-static
    make -j$(node -p 'os.cpus().length + 1')

    # --scripts-prepend-node-path is to ensure we use the just-built node executable
    # -static-libgcc is required for sqlite3 to build correctly
    LDFLAGS='-static-libgcc -static-libstdc++' ./node ./deps/npm/bin/npx-cli.js npm install sqlite3 --build-from-source --scripts-prepend-node-path
    ./node -e 'sqlite3 = require("sqlite3"); db = new sqlite3.Database(":memory:"); db.get("select 1", (err, r) => console.log(r));'

Licence: This code is ISC, however note that musl-cross-make is imported into
this repo and it's licence is unclear.
