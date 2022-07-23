const { detect } = require('../../dist/tinyld.normal.node.js')

const language = detect('これは日本語です.')
console.log(`Detect Language ${language}`)
process.exit(language === 'ja' ? 0 : 1)
