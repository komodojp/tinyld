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
- support 64 languages (24 for the web version)
- format ISO 639-1

## Extra

- [**Playground** - Try the library](https://runkit.com/kefniark/tinyld)
- [Getting Started](./docs/install.md)
- [API](./docs/api.md)
- [CLI](./docs/cli.md)
- [TinyLD Web](./docs/light.md)
- [Supported Language](./docs/langs.md)
- [Algorithm](./docs/algorithm.md)
- [Developer](./docs/dev.md)

---

## Getting Started

### Install

```sh
yarn add tinyld # or npm install --save tinyld
```

[Install Documentation](./docs/install.md)

### API

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

## Benchmark

> Benchmark done on tatoeba dataset (~9M sentences) on 16 of the most common languages.

| Library        | Script                      | Properly Identified | Improperly identified | Not identified | Avg Execution Time | Disk Size |
| -------------- | --------------------------- | ------------------- | --------------------- | -------------- | ------------------ | --------- |
| **TinyLD**     | `yarn bench:tinyld`         | **97.7311%**        | **1.9247%**           | **0.3441%**    | 0.0922ms.          | 930KB     |
| **TinyLD Web** | `yarn bench:tinyld-light`   | **97.4512%**        | 2.1131%               | **0.4358%**    | **0.0672ms.**      | **110KB** |
| **node-cld**   | `yarn bench:cld`            | **88.9148%**        | **1.7489%**           | 9.3363%        | **0.0612ms.**      | > 10MB    |
| node-lingua    | `yarn bench:lingua`         | 82.3157%            | **0.2158%**           | 17.4685%       | 0.7085ms.          | ~100MB    |
| franc          | `yarn bench:franc`          | 68.7783%            | 26.3432%              | **4.8785%**    | 0.1381ms.          | 267KB     |
| franc-min      | `yarn bench:franc-min`      | 65.5163%            | 23.5794%              | 10.9044%       | **0.0614ms.**      | **119KB** |
| languagedetect | `yarn bench:languagedetect` | 61.6068%            | 12.295%               | 26.0982%       | 0.1585ms.          | **240KB** |

### **Remark**

- For each category, top3 results are in **Bold**
- Language evaluated in this benchmark:
  - Asia: `jpn`, `cmn`, `kor`, `hin`
  - Europe: `fra`, `spa`, `por`, `ita`, `nld`, `eng`, `deu`, `fin`, `rus`
  - Middle east: , `tur`, `heb`, `ara`
- This kind of benchmark is not perfect and % can vary over time, but it gives a good idea of overall performances

### **Conclusion**

#### Recommended

- For **NodeJS**: `TinyLD` or `node-cld` (fast and accurate)
- For **Browser**: `TinyLD Light` or `franc-min` (small, decent accuracy, franc is less accurate but support more languages)

#### Not recommended

- `node-lingua` is just too big and slow
- `languagedetect` is light but just not accurate enough, really focused on indo-european languages (support kazakh but not chinese, korean or japanese)
