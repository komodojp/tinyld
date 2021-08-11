# Algorithm

This library uses a variant of the usual N-gram algorithm, which gives fast and good results.

Most libraries are directly using a bayesian scoring algorithm to identify a text language. But TinyLD, decided to add a step before, trying to mimic human logic and identify language with their unique character patterns.

## First pass

Some languages like japanese or korean can be identified right away, just based on their characters or punctuation and dont even need to reach the scoring algorithm.

**Example**:

- `も` is japanese
- `두` is korean
- `où` is french

This identification is done on different sizes of grams (including 1-gram and 2-gram), which give better results than other libraries on short texts.

**This pass is**:

- really fast (a lookup in a map)
- return only one locale (local detected this way are really accurate)
- but ~20% of text are not detected with this method

## Second pass

More traditional method of statistical analysis. Run on 3-grams, try to find which locale they could match and score them.
At the end, sort by score and return the most probable one.

**This pass is**:

- probabilistic
- return multiples locale and they have to be scored and sorted
