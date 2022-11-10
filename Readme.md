# TinyLD

[![npm](https://img.shields.io/npm/v/tinyld)](https://www.npmjs.com/package/tinyld)
[![npm](https://img.shields.io/npm/dm/tinyld)](https://www.npmjs.com/package/tinyld)
[![CDN Download](https://data.jsdelivr.com/v1/package/npm/tinyld/badge)](https://www.jsdelivr.com/package/npm/tinyld)
[![License](https://img.shields.io/npm/l/tinyld.svg)](https://npmjs.org/package/tinyld)

![logo](./banner.png)

## :tada: Description

**Tiny** **L**anguage **D**etector, simply detect the language of a unicode UTF-8 text:

- Pure JS, No api call, No dependencies (Node and Browser compatible)
- Blazing fast and low memory footprint (unlike ML methods)
- Train with dataset from [Tatoeba](https://tatoeba.org/en/) and [UDHR](https://unicode.org/udhr/)
- Support [62 languages](./docs/langs.md) (24 for [the web version](./docs/light.md))
- Reliable even for really short texts (chatbot, keywords, ...)
- Support both ISO-639-1 & ISO-639-2
- Available for NodeJS (`CommonJS` and `ESM`), Deno and Browser

## Links

- [**Playground** - Try the library](https://komodojp.github.io/tinyld/)
- [Play with some code](https://runkit.com/kefniark/tinyld)
- [Getting Started](./docs/install.md)
- [Supported Languages](./docs/langs.md)
- [Algorithm](./docs/algorithm.md)
- [Frequently Asked Questions](./docs/faq.md)

---

## :floppy_disk: Getting Started

### Install

```sh
yarn add tinyld # or npm install --save tinyld
```

[Install Documentation](./docs/install.md)

---

### :page_facing_up: **TinyLD API**

```js
import { detect, detectAll } from 'tinyld'

// Detect
detect('これは日本語です.') // ja
detect('and this is english.') // en

// DetectAll
detectAll('ceci est un text en francais.')
// [ { lang: 'fr', accuracy: 0.5238 }, { lang: 'ro', accuracy: 0.3802 }, ... ]
```

[API Documentation](./docs/api.md)

---

### :paperclip: **TinyLD CLI**

```bash
tinyld This is the text that I want to check
# [ { lang: 'en', accuracy: 1 } ]
```

[More Information](./docs/cli.md)

---

## :chart_with_upwards_trend: Performance

Here is a comparison of **Tinyld** against other popular libraries.

![SVG Graph](./docs/overall.svg)

To summary in one sentence:

> Better, Faster, Smaller

[More Benchmark Information](./docs/benchmark.md)

---

## Developer

You want to **Contribute** or **Open a PR**, it's recommend to take a look [at the dev documentation](./docs/dev.md)
