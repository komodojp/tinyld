# TinyLD

[![npm](https://img.shields.io/npm/v/tinyld)](https://www.npmjs.com/package/tinyld)
[![npm](https://img.shields.io/npm/dm/tinyld)](https://www.npmjs.com/package/tinyld)
[![CDN Download](https://data.jsdelivr.com/v1/package/npm/tinyld/badge)](https://www.jsdelivr.com/package/npm/tinyld)
[![License](https://img.shields.io/npm/l/tinyld.svg)](https://npmjs.org/package/tinyld)

![logo](./banner.png)

**Tiny** **L**anguage **D**etector, simply detect the language of a unicode UTF-8 text:

- pure javascript, no api call, and no dependency (node and browser compatible)
- alternative to libraries like CLD
- blazing fast and low memory footprint (unlike ML methods)
- support [64 languages](./docs/langs.md) (24 for [the web version](./docs/light.md))
- format ISO 639-1 & ISO 639-2

## Links

- [**Playground** - Try the library](https://runkit.com/kefniark/tinyld)
- [Getting Started](./docs/install.md)
- [API](./docs/api.md)
- [CLI](./docs/cli.md)
- [Supported Languages](./docs/langs.md)
- [Algorithm](./docs/algorithm.md)

---

## Getting Started

### Install

```sh
yarn add tinyld # or npm install --save tinyld
```

[Install Documentation](./docs/install.md)

---

### **TinyLD API**

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

### **TinyLD CLI**

```bash
tinyld This is the text that I want to check
# [ { lang: 'en', accuracy: 1 } ]
```

[More Information](./docs/cli.md)

---

## Performance

Here is a comparison of **Tinyld** against other popular libraries.

![SVG Graph](./docs/overall.svg)

To summary in one sentence:

> Better, Faster, Smaller

[More Information](./docs/benchmark.md)
