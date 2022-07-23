import { detect } from '../../dist/tinyld.normal.node.mjs'

const language = detect('これは日本語です.')
console.log(`Detect Language ${language}`)
Deno.exit(language === 'ja' ? 0 : 1)
