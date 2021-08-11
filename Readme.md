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
- support 50 languages
- works on small texts too
- format ISO 639-1

## Extra

- [Try the library](https://runkit.com/kefniark/tinyld)
- [Getting Started](./docs/install.md)
- [Algorithm](./docs/algorithm.md)
- [CLI](./docs/cli.md)
- [TinyLD Light](./docs/light.md)
- [Developer](./docs/dev.md)

---

## Getting Started

### Install

```sh
yarn add tinyld # or npm install --save tinyld
```

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

[More Information](./docs/install.md)

---

### **TinyLD CLI**

```bash
tinyld This is the text that I want to check
# [ { lang: 'en', accuracy: 1 } ]
```

[More Information](./docs/cli.md)

---

## Benchmark

| Library        | Script                      | Properly Identified | Improperly identified | Not identified | Avg Execution Time | Disk Size |
| -------------- | --------------------------- | ------------------- | --------------------- | -------------- | ------------------ | --------- |
| TinyLD         | `yarn bench:tinyld`         | 95.6304%%           | 4.3696%               | 0%             | 50.4203ms.         | 878KB     |
| TinyLD Light   | `yarn bench:tinyld-light`   | 91.7805%            | 8.2195%               | 0%             | 38.4051ms.         | 92KB      |
| node-cld       | `yarn bench:cld`            | 87.1121%            | 1.8074%               | 11.08%         | 56.38ms.           | > 10MB    |
| franc          | `yarn bench:franc`          | 65.3913%            | 34.6087%              | 0%             | 132.59ms.          | 353.5kb   |
| languagedetect | `yarn bench:languagedetect` | 58.0877%            | 13.4809%              | 28.4414%       | 159.56ms.          | 243.6kb   |

**Remark**

- This benchmark is done on tatoeba dataset (~9M sentences) on 16 of the most common languages.
- This kind of benchmark is not perfect and % can vary over time, but it gives a good idea of overall performances
- To avoid any unfair advantage to **TinyLD**, the dataset is reversed between `training` and `benchmark`. It means that most sentences tested during benchmark are not part of the training set.
