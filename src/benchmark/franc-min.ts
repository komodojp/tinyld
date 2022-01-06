import { toISO2 } from '../core'
import { benchmark } from './bench'
import fs from 'fs'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const franc = require('franc-min')

const langMap: { [id: string]: string } = {
  arb: 'ara',
  fas: 'pes',
  lav: 'lat',
  nno: 'nob'
}

function detect(val: string): string {
  let res = franc(val)
  if (res === 'und') res = ''
  else if (res in langMap) res = langMap[res]
  return res ? toISO2(res) : ''
}

;(async () => {
  const res = await benchmark(detect)
  if (!fs.existsSync('./data/bench')) fs.mkdirSync('./data/bench')
  fs.writeFileSync('./data/bench/franc-min.json', JSON.stringify(res, null, 2))
})()
