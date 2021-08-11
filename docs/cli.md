# **TinyLD CLI**

Time to time, it can be easier to use the library from a terminal _(Example: testing or debugging)_

```sh
tinyld This is the text that I want to check
# [ { lang: 'en', accuracy: 1 } ]

tinyld これはテストです
# [ { lang: 'ja', accuracy: 1 } ]

tinyld Єсть на світі доля
# [ { lang: 'uk', accuracy: 1 } ]
```

_Options_

- `--verbose` : Get an explanation of why **TinyLD** pick a language
- `--only=en,ja,fr` : Restrict the detection to a subset of languages

Can also be run with:

- Npx: `npx tinyld [message]`
- Yarn: `yarn tinyld [message]`
- Bash: `./node_modules/.bin/tinyld [message]`

## Verbose mode (debugging)

```sh
> yarn tinyld --verbose this is a text

[Pass 1] detectUniqueGrams of 1-grams [
  't', 'h', 'i', 's',
  'i', 's', 'a', 't',
  'e', 'x', 't'
]
[Pass 1] detectUniqueGrams of 2-grams [
  ' t', 'th', 'hi', 'is',
  's ', ' i', 'is', 's ',
  ' a', 'a ', ' t', 'te',
  'ex', 'xt', 't '
]

# ...

Gram 'a t' [
  'ind = 43.830000000000005%',
  'tgl = 15.5%',
  'epo = 41.199999999999996%',
  'spa = 90.59%',
  'por = 53.47%',
  'ita = 65.4%',
  'srp = 30.320000000000004%',
  'fin = 94.69999999999999%',
  'hun = 100%',
  'pol = 31.680000000000003%'
]
Gram ' te' [
  'ind = 18.060000000000002%',
  'epo = 10.31%',
  'eng = 9.44%',
  'por = 97.13000000000001%',
  'ita = 13.65%',
  'nld = 100%',
  'lat = 37.85%',
  'srp = 3.6700000000000004%',
  'fin = 22.67%',
  'ron = 6.59%'
]
Gram 'ext' [ 'eng = 59.14%', 'spa = 100%' ]
Gram 'xt ' [ 'eng = 100%' ]
Result this is a text [
  { lang: 'en', accuracy: 0.7667, score: 2274.35 },
  { lang: 'eo', accuracy: 0.3133, score: 6695.6 },
  { lang: 'nl', accuracy: 0.3104, score: 6723.8 },
  { lang: 'pt', accuracy: 0.2754, score: 7064.75 },
  { lang: 'la', accuracy: 0.2662, score: 7154.35 }
]
[
  { lang: 'en', accuracy: 0.7667, score: 2274.35 },
  { lang: 'eo', accuracy: 0.3133, score: 6695.6 },
  { lang: 'nl', accuracy: 0.3104, score: 6723.8 },
  { lang: 'pt', accuracy: 0.2754, score: 7064.75 },
  { lang: 'la', accuracy: 0.2662, score: 7154.35 }
]
```
