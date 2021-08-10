import { benchmark } from './bench'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cld = require('cld')

const langMap: { [id: string]: string } = {
  iw: 'he', // hebrew changed in 1988, no idea why cld is still using this
  'zh-Hant': 'zh',
  'xx-Java': 'jv',
  ms: 'id',
  jw: 'jv'
}

async function detect(val: string) {
  try {
    const result = await cld.detect(val)
    let res = result.languages[0].code
    if (res in langMap) res = langMap[res]
    return res
  } catch (err) {
    //
  }
  return ''
}

const hrstart = process.hrtime()
benchmark(detect)
const hrend = process.hrtime(hrstart)
console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
