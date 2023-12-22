# URL Debugger

A tool for debugging URLs.

## Getting the tool

Go and pick the right binary file from the list in the
[available releases](https://github.com/santiago-rodrig/url-debugger/releases)
of this tool.

## Building process

You must install the dependencies first with `npm install`.
Once you have the dependencies ready you must
run the `build` script with the build target of your
computer, the following example is for building
the tool for the `linux` platform with a CPU built
with the `amd64` architecture.

```bash
npm run build -- -t node18-linux-amd64
```

You will see the binary at `bin/url-debugger.exe`.

## Developing locally

Just run `npm install`. After that start by
reading `src/main.js`, extend that if you wish.

## License

Go and [read it](./LICENSE.md).