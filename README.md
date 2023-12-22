# URL Debugger

A tool for debugging URLs.

## How to install?

You have two options.

1. Build the binary yourself.
2. Download the binary from the available releases.

If you decide to go ahead with **option 1** you must
install the dependencies first
(see the [local setup instructions](#local-setup)).
Once you have the dependencies ready you must
run the `build` script with the build target of your
computer, the following example is for building
the tool for the `linux` platform with a CPU built
with the `amd64` architecture.

```bash
npm run build -- -t node18-linux-amd64
```

For **option 2** you just need to pick the right
binary file from the list in the available releases
of this tool.

## Local setup for development

Just run `npm install`. After that start by
reading `src/main.js`, extend that if you wish.

## License

Go and [read it](./LICENSE.md).