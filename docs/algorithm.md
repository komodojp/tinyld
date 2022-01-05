# Algorithm

This library uses a variant of the usual N-gram algorithm, which gives fast and good results.

Most libraries are directly using a bayesian scoring algorithm to identify a text language. But TinyLD, decided to add few steps before and after, trying to mimic human logic and identify language with their unique character patterns or word usage.

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

```
--- Per language Accuracy ---
 - fra - 91.1079%
 - deu - 98.5069%
 - eng - 97.507%
 - rus - 92.241%
 - jpn - 99.96%
 - spa - 88.2282%
 - por - 94.2674%
 - ita - 92.3744%
 - cmn - 97.4537%
 - ara - 98.9468%
 - heb - 100%
 - fin - 92.7743%
 - tur - 96.0139%
 - kor - 99.8933%
 - jav - 74.2857%
 - hin - 95.8406%
```

---

## How the library can be so small ? (~700KB for node, ~90KB for web)

In a normal n-gram algorithm, between languages there are lot of overlap, duplicates or non specific grams (which match more than 15 languages). Gram are just downloaded and check at runtime, which is not really optimized.

Our multi-pass model allow us to have a really compact language profile file.

- **AOT Logic**: the language profiles are pre-compiled ahead of time (avoid duplicates and not relevant gram/words)
- **Per Language logic**: language really well detected in one method >98% are removed from other methods (with their data)
- **Pass Exclusion**: gram detected in one pass are automatically ignored by later pass, this allow us to greatly reduce the size of n-gram (or words) to store and check
