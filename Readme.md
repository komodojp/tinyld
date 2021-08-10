# TinyLD

![npm](https://img.shields.io/npm/v/tinyld)
![npm](https://img.shields.io/npm/dm/tinyld)

![logo](./banner.png)

**Tiny** **L**anguage **D**etector, simply detect the language of a unicode UTF-8 text:

- pure javascript and no dependency (node and browser compatible)
- blazing fast and low memory footprint (unlike ML methods)
- support 50 languages
- works on small texts too
- format ISO 639-1

This is an alternative to libraries like CLD

---

## Getting Started

### Install

```sh
# for npm users
npm install --save tinyld

# for yarn users
yarn add tinyld
```

### API

```js
import { detect, detectAll } from 'tinyld'
// or node: `const { detect } = require('tinyld')`

// Detect
detect('ceci est un text en francais.') // fr
detect('これは日本語です.') // ja
detect('and this is english.') // en

// DetectAll
detectAll('ceci est un text en francais.') // [ { lang: 'fr', accuracy: 0.5238 }, { lang: 'ro', accuracy: 0.3802 }, ... ]
```

---

## TinyLD (Light Flavor, for web usage)

The normal library can be a bit massive (mostly caused by the language profile database), which can be problematic for web usage.

For this usage we also provide a lighter version (a tradeoff between disk size and accuracy)

- import with: `import { detect } from 'tinyld/dist/tinyld.light.cjs'`
- normal version ~800KB, light version is only ~90KB
- only 30 languages supported
- slightly less accurate, only ~90%

---

## Algorithm

This library uses a variant of the usual N-gram algorithm, which gives fast and good results.

Most libraries are directly doing the bayesian scoring algorithm. But TinyLD, decided to add a step before, trying to mimic human logic and identify language with their unique character patterns.

Some languages like japanese or korean can be identified right away, just based on their characters or punctuation and dont even need to reach the scoring algorithm.

### First pass

Try to identify sequence of characters unique to a language

**Example**:

- `も` is japanese
- `두` is korean
- `où` is french

This identification is done on different sizes of grams (including 1-gram and 2-gram), which give better results than other libraries on short texts.

**This pass is**:

- really fast (a lookup in a map)
- return only one locale (local detected this way are really accurate)
- but ~20% of text are not detected with this method

### Second pass

More traditional method of statistical analysis. Run on 3-grams, try to find which locale they could match and score them.
At the end, sort by score and return the most probable one.

**This pass is**:

- probabilistic
- return multiples locale and they have to be scored and sorted

---

## Benchmark

| Library        | Script                      | Properly Identified | Improperly identified | Not identified | Avg Execution Time | Disk Size |
| -------------- | --------------------------- | ------------------- | --------------------- | -------------- | ------------------ | --------- |
| TinyLD         | `yarn bench:tinyld`         | 95.8876%%           | 4.1124%               | 0%             | 45.4203ms.         | 878KB     |
| TinyLD Light   | `yarn bench:tinyld-light`   | 91.822%             | 8.178%                | 0%             | 36.4051ms.         | 92KB      |
| node-cld       | `yarn bench:cld`            | 87.1121%            | 1.8074%               | 11.08%         | 56.38ms.           | > 10MB    |
| franc          | `yarn bench:franc`          | 65.3913%            | 34.6087%              | 0%             | 132.59ms.          | 353.5kb   |
| languagedetect | `yarn bench:languagedetect` | 58.0877%            | 13.4809%              | 28.4414%       | 159.56ms.          | 243.6kb   |

**Remark**

- This benchmark is done on tatoeba dataset (~9M sentences) on 16 of the most common languages.
- This kind of benchmark is not perfect and % can vary over time, but it gives a good idea of overall performances
- To avoid any unfair advantage to **TinyLD**, the dataset is reversed between `training` and `benchmark`. It means that most sentences tested during benchmark are not part of the training set.

## Development

```sh
# install deps
yarn

# train and generate language profiles
yarn train

# build the library
yarn build

# code style linting
yarn lint

# test
yarn test
```
