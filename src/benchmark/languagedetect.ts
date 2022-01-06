import { benchmark } from './bench'
import fs from 'fs'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const languageDetect = require('languagedetect')
const lngDetector = new languageDetect()
lngDetector.setLanguageType('iso2')

function detect(val: string): string {
  const res = lngDetector.detect(val)
  if (res.length > 0) return res[0][0] || ''
  return ''
}

;(async () => {
  const res = await benchmark(detect)
  if (!fs.existsSync('./data/bench')) fs.mkdirSync('./data/bench')
  fs.writeFileSync('./data/bench/languagedetect.json', JSON.stringify(res, null, 2))
})()
