import { benchmark } from './bench'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const languageDetect = require('languagedetect')
const lngDetector = new languageDetect()
lngDetector.setLanguageType('iso2')

function detect(val: string): string {
  const res = lngDetector.detect(val)
  if (res.length > 0) return res[0][0] || ''
  return ''
}

benchmark(detect)
