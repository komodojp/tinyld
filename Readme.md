# TinyLD

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

### Use

```js
import { detect } from 'tinyld'
// or node: `const { detect } = require('tinyld')`

detect('ceci est un text en francais.') // fr
detect('これはにほんごです.') // ja
detect('and this is english.') // en
```

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

This benchmark will try to detect language of sentence from the tatoeba database (~9M sentences) on 16 of the most common languages.

### Library **TinyLD** (this one)

> Run: `yarn bench:tinyld`

> - Properly identified: 94.85%
> - Improperly identified: 5.15%
> - Unidentified: 0%
> - Avg exec time: 41.81ms.

### Library **node-cld**

> Run: `yarn bench:cld`

> - Properly identified: 87.11%
> - Improperly identified: 1.81%
> - Unidentified: 11.08%
> - Avg exec time: 56.38ms.

### Library **franc**

> Run: `yarn bench:franc`

> - Properly identified: 65.39%
> - Improperly identified: 34.61%
> - Unidentified: 0%
> - Avg exec time: 132.59ms.

### Library **languagedetect**

> Run: `yarn bench:languagedetect`

> - Properly identified: 58.08%
> - Improperly identified: 13.48%
> - Unidentified: 28.44%
> - Avg exec time: 159.56ms.

#### Remark

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
