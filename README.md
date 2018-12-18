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
Node from loading any native modules.

Licence: This code is ISC, however note that musl-cross-make is imported into
this repo and it's licence is unclear.
