import { detect } from '../index'
import { benchmark } from './bench'
import fs from 'fs'
;(async () => {
  const res = await benchmark(detect)
  if (!fs.existsSync('./data/bench')) fs.mkdirSync('./data/bench')
  fs.writeFileSync('./data/bench/tinyld.json', JSON.stringify(res, null, 2))
})()
