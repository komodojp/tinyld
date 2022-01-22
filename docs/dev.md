# Development

## Commands

```sh
# Install
yarn

# Build
yarn build

# Test
yarn test

# Lint / Auto-fix code style problems
yarn lint
```

---

## Install issues

For the moment the library has lot of dev-dependencies purely for the benchmark process.
Some of those libraries need to compile native code, which can be problematic (gcc, gyp, python, ...)

If you run into those issues, one of the easiest solution is to remove the problematic dependencies from `package.json` then try again to install.

[like here](https://github.com/komodojp/tinyld/issues/10#issuecomment-1019085476)

It will only cause issue with `yarn bench`, but everything else should still work normally

---

## Optional

### 1. Generate profiles (`yarn train`)

This step require lot of data and time, so it's optional and the result are store directly in git.

This will analyse lot fo text in different language and build statistics to be able to identify the best features for each language

To be able to train the model, you will need first to have the dataset locally

```
Download Datasets
 - Download the [Tatoeba sentence export](https://downloads.tatoeba.org/exports/sentences.tar.bz2)
 - Extract in `data/tatoeba.csv`
 - Download the [UDHR](https://unicode.org/udhr/assemblies/udhr_txt.zip)
 - Extract in `data/udhr/`

Run yarn train
  - For each language, it will build statistics for words and n-grams
  - This goes through massive amount of data and will take time, prepare few coffee

When your profile files are generated, you can run `yarn build` and you will have a build with those new data
```

### 2. Generate benchmark data (`yarn bench`)

This step require a bit of time, it will run lot of different test for a set of libraries to generate the benchmark page and diagrams.
