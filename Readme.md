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
- format ISO 639-1

## Extra

- [**Playground** - Try the library](https://runkit.com/kefniark/tinyld)
- [Getting Started](./docs/install.md)
- [API](./docs/api.md)
- [CLI](./docs/cli.md)
- [TinyLD Light](./docs/light.md)
- [Algorithm](./docs/algorithm.md)
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
| **TinyLD**     | `yarn bench:tinyld`         | **95.4156%**        | **3.2471%**           | **1.3373%**    | **0.0918ms.**      | 676KB     |
| **TinyLD Web** | `yarn bench:tinyld-light`   | **90.4754%**        | 5.0452%               | **4.4794%**    | **0.0605ms.**      | **90KB**  |
| **node-cld**   | `yarn bench:cld`            | **86.7068%**        | **2.1064%**           | 11.1868%       | **0.0563ms.**      | > 10MB    |
| node-lingua    | `yarn bench:lingua`         | 82.3157%            | **0.2158%**           | 17.4685%       | 0.7085ms.          | ~100MB    |
| franc          | `yarn bench:franc`          | 64.7064%            | 35.2936%              | **0%**         | 0.1325ms.          | **350KB** |
| languagedetect | `yarn bench:languagedetect` | 60.0853%            | 13.3216%              | 26.5931%       | 0.1595ms.          | **240KB** |

### **Remark**

- For each category, 3 Best results are mark in **Bold**
- Language evaluated in this benchmark:
  - Asia: `jpn`, `cmn`, `kor`, `hin`
  - Europe: `fra`, `spa`, `por`, `ita`, `nld`, `eng`, `deu`, `fin`, `rus`
  - Middle east: , `tur`, `heb`, `ara`
- This benchmark is done on tatoeba dataset (~9M sentences) on 16 of the most common languages.
- This kind of benchmark is not perfect and % can vary over time, but it gives a good idea of overall performances

### **Conclusion**

#### Recommanded

- For **NodeJS**: `TinyLD` or `node-cld` (fast and accurate)
- For **Browser**: `TinyLD Light` or `franc` (small and decent accuracy)

#### Not recommended

- `node-lingua` is just too massive and slow
- `languagedetect` is light but just not accurate enough, really focused on indo-european languages (support kazakh but no chinese, korean or japanese)
