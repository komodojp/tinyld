# Getting Started

## Install

```sh
# for npm users
npm install --save tinyld

# for yarn users
yarn add tinyld
```

## API

```js
import { detect, detectAll } from 'tinyld'
// or node: `const { detect } = require('tinyld')`

// Detect
detect('ceci est un text en francais.') // fr
detect('これは日本語です.') // ja
detect('and this is english.') // en

// DetectAll
detectAll('ceci est un text en francais.')
// [ { lang: 'fr', accuracy: 0.5238 }, { lang: 'ro', accuracy: 0.3802 }, ... ]
```

---

[More about the API Documentation](./api.md)
