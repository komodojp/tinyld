# Algorithm

This library uses a variant of the usual N-gram algorithm, which gives fast and good results.

Most libraries are directly using a bayesian scoring algorithm to identify a text language. But TinyLD, decided to add few steps before and after, trying to mimic human logic and identify language with their unique character patterns or word usage.

This is similar to what ML methods use, that's why this library has a training phase too. The goal is to find which "features" or "n-gram" are the more useful for detection without hardcoding any language specific rules. The heavy lifting is done during build time, so at runtime it can be fast and efficient.

## How it works ?

The string will be split into chunks based on punctuation. Each chunk will be evaluated separately and results merged later weighted with the chunk size.

This allow to handle mixed language content

```js
'This is a text in english "おはよう" and we can continue to write (and this is english too)'
```

```js
'this is a text in english', // => will be detected as EN
  'おはよう', // => will be detected as JA
  'and we can continue to write',
  'and this is english too'
```

Then each chunk will be evaluated with the following method:

---

### **1) First pass**: Unique Character Detection

Some languages like japanese or korean can be identified right away, just based on their characters or punctuation and dont even need to reach the scoring algorithm.

**Example**:

- `も` is japanese
- `두` is korean
- `où` is french

This identification is done on different sizes of grams (including 1-gram and 2-gram), which give better results than other libraries on short texts.

**This pass is**:

- really fast (a lookup in a map)
- return only one locale (local detected this way are really accurate)

---

### **2) Second pass**: Gram Detection (2-gram, 3-gram, ...)

Most of the other libraries are only using this part.
More traditional method of statistical analysis on grams.
Split each word in 4-gram and for each of them try to find languages that match and score them.

**This pass is**:

- probabilistic
- return multiples locale and they have to be scored and sorted
- remove grams already covered by previous step (to save space)

---

## Why doing all that ? Is gram analysis not good enough ?

Individually, the accuracy of each method is not really high

- Unique character detection: ~65%
- Gram detection: ~85%

But what allows this library to be so good, is that those detection methods are complementary and work together.

For example:

- Japanese accuracy is good thanks to character detection (JA ~99% but EN ~15%)
- English accuracy is good thanks to word detection (JA ~1.5% but EN ~98%)

Which is why together those methods get an overall accuracy > 95%
