import { toISO2 } from '../core'
import { benchmark } from './bench'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const franc = require('franc')

const langMap: { [id: string]: string } = {
  arb: 'ara',
  fas: 'pes',
  lav: 'lat',
  nno: 'nob'
}

function detect(val: string): string {
  let res = franc(val)
  if (res in langMap) res = langMap[res]
  return toISO2(res)
}

benchmark(detect)
