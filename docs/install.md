# Getting Started

## NodeJS

```sh
# for npm users
npm install --save tinyld

# for yarn users
yarn add tinyld
```

Then usage

```ts
const { detect } = require('tinyld')
// or ESM
import { detect } from 'tinyld'
```

## Browser Usage (CDN)

```html
<script type="module">
  import { detect } from 'https://cdn.jsdelivr.net/npm/tinyld@1.3.0/dist/tinyld.normal.browser.js'
  // ...
</script>
```

## Deno (Pika CDN)

```ts
import { detect } from 'https://cdn.skypack.dev/tinyld'
```

---

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
