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
> yarn install tinyld

or

> npm install --save tinyld

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

This library use a variant of usual N-gram algoritm, which give decent accuraccy and is blazing fast. Most library are directly doing

### First pass

Try to identify sequence of characters unique to a language

Example:
* `も` is japanese
* `두` is korean
* `où` is french

this identification is done on different size of grams (includes even 1-gram and 2-gram), which give better result than other library for short texts.

This pass is:
* really fast (a lookup in a map)
* return only one locale (local detected this way are really accurate)
* but 15~20% of text are not detected with this method

### Second pass

More traditional method of statistic analysis. Run on 3-grams, try to find which locale they could match and score them.

At the end, sort by score and return the more probably one.

This pass is:
* probabilistic
* return multiples locale and they have to be scored and sorted

---

## Benchmark

This benchmark will try to detect language of string from the tatoeba database (~9M sentences) on 16 of the most common languages

### TinyLD
Run: ```yarn bench:tinyld```

> - Properly identified: 97.14%
> - Unproperly identified: 2.86%
> - Unidentified: 0%
> - Avg exec time: 36.87ms.

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
