# Development

## Setup

To be able to train the model

- Download the [Tatoeba sentence export](https://downloads.tatoeba.org/exports/sentences.tar.bz2)
- Extract in `data/tatoeba.csv`

- Download the [UDHR](https://unicode.org/udhr/assemblies/udhr_txt.zip)
- Extract in `data/udhr/`

## Commands

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
