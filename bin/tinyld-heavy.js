#! /usr/bin/env node
const { detectAll } = require('../dist/tinyld.heavy.node.js')

function main() {
  const [, , ...args] = process.argv

  let onlyLangs = []
  let verbose = false

  const texts = []
  for (const arg of [...args]) {
    if (arg.startsWith('--only=')) {
      onlyLangs = arg.replace('--only=', '').split(',')
      continue
    }

    if (arg.startsWith('--verbose') || arg.startsWith('-v')) {
      verbose = true
      continue
    }

    texts.push(arg)
  }
  const message = texts.join(' ')
  const options = { only: onlyLangs, verbose }
  console.log(detectAll(message, options))
}

main()
