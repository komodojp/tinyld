import { benchmark } from './bench'
import fs from 'fs'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { detect } = require('langdetect')

function langdetect(val: string): string {
  const res = detect(val)
  if (res && res.length > 0) {
    const lang = res[0].lang || ''
    if (['zh-cn', 'zh-tw'].includes(lang)) return 'zh'
    return lang
  }
  return ''
}

;(async () => {
  const res = await benchmark(langdetect)
  if (!fs.existsSync('./data/bench')) fs.mkdirSync('./data/bench')
  fs.writeFileSync('./data/bench/langdetect.json', JSON.stringify(res, null, 2))
})()
