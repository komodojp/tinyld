#!/bin/sh

cd "$(dirname "$0")"

echo "> Check DENO"
deno run ./deno/index.ts

echo "> Check NODE"
node ./node/index.js

echo "> Check NODE ESM"
node ./node-esm/index.js
