# %PROJECT_NAME%

## Requirements

[Galbe](https://galbe.dev) applications require [Bun](https://bun.sh) to be installed.

## Setup

To setup a new [Galbe](https://galbe.dev) app with.

Install dependencies:

```bash
bun install
```

Run the dev server:

```bash
bun dev
```

## Usage

```bash
curl http://localhost:3000/hello
```

```bash
curl http://localhost:3000/hello?name=Pierre
```

## Build

To bundle your Galbe app, simply run:

```bash
bun run buid
```

It will bundle your app under `dist` directory by default.
