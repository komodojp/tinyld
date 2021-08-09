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

detect("ceci est un text en francais.") // fr
detect("これはにほんごです.") // ja
detect("and this is english.") // en
```

---

## Algorithm

This library use a variant of usual N-gram algoritm, which give fast and good results.

Most libraries are directly doing the bayesian scoring algorithm. But TinyLD, decided to add a step before, trying to mimic human logic and identify language with their unique character patterns.

Some language like japanese or korean can be identified right away, just based on their characters or punctuation and dont even need to reach the scoring algorithm.

### First pass

Try to identify sequence of characters unique to a language

**Example**:
* `も` is japanese
* `두` is korean
* `où` is french

this identification is done on different size of grams (includes even 1-gram and 2-gram), which give better result than other library on short texts.

**This pass is**:
* really fast (a lookup in a map)
* return only one locale (local detected this way are really accurate)
* but ~20% of text are not detected with this method

### Second pass

More traditional method of statistic analysis. Run on 3-grams, try to find which locale they could match and score them.

At the end, sort by score and return the more probably one.

**This pass is**:
* probabilistic
* return multiples locale and they have to be scored and sorted

---

## Benchmark

This benchmark will try to detect language of sentence from the tatoeba database (~9M sentences) on 16 of the most common languages

### TinyLD
Run: ```yarn bench:tinyld```

> - Properly identified: 98.46%
> - Unproperly identified: 1.54%
> - Unidentified: 0%
> - Avg exec time: 34ms.

### node-cld
Run: ```yarn bench:cld```

> - Properly identified: 88.51%
> - Unproperly identified: 1.8%
> - Unidentified: 9.69%
> - Avg exec time: 55.56ms.

### franc
Run: ```yarn bench:franc```

> - Properly identified: 68.75%
> - Unproperly identified: 31.25%
> - Unidentified: 0%
> - Avg exec time: 128.95ms

### languagedetect
Run: ```yarn bench:languagedetect```

> - Properly identified: 58.86%
> - Unproperly identified: 13.09%
> - Unidentified: 28.04%
> - Avg exec time: 161.22ms.

---

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
