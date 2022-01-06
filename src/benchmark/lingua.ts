import { LanguageDetector } from 'lingua-node'
import { benchmark } from './bench'
import fs from 'fs'

const detector = new LanguageDetector()

;(async () => {
  const res = await benchmark((txt) => detector.detectLanguage(txt) || '')
  if (!fs.existsSync('./data/bench')) fs.mkdirSync('./data/bench')
  fs.writeFileSync('./data/bench/lingua.json', JSON.stringify(res, null, 2))
})()
