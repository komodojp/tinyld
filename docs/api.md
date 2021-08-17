# API

## Language Detection

### Detect

```js
// basic detection
detect('this is the text') // => 'en'

// verbose mode
detect('this is the text', { verbose: true }) // => 'en'

// only in a subset of languages
detect('this is the text', { only: ['fr', 'en', 'nl'] }) // => 'en'
```

### Detect All

```js
detectAll('this is the text')
/*
[
  { lang: 'en', accuracy: 0.958076923076923 },
  { lang: 'nl', accuracy: 0.15384615384615385 },
  { lang: 'ga', accuracy: 0.14555384615384614 },
  { lang: 'lt', accuracy: 0.03804615384615384 },
  { lang: 'vo', accuracy: 0.03303076923076923 },
  { lang: 'hu', accuracy: 0.022338461538461536 },
  { lang: 'la', accuracy: 0.006738461538461531 },
  { lang: 'fr', accuracy: 0.0025153846153846203 }
]
*/
```

---

## Language Code Conversion

This library also expose some language code conversion functions, to switch between iso2 (`ISO 639-1`) and iso3 (`ISO 639-3`) and get compatible with a range of API/Tools.

```js
toISO2('jpn') // ja
toISO3('jp') // jpn
toISO3('ja') // jpn
```

Also contains some alias for deprecated or common mistakes (`jp` is an alias of `ja`, `cn` is an alias of `zh`, ...)
