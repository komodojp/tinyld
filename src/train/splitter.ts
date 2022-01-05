import fs from 'fs'
import readline from 'readline'
import { cleanString } from '../clean'
import { wordTokenizer } from '../tokenizer'

export interface FreqWord {
  word: string
  count: number
}

export async function processTatoebaLineByLine(fileIn: string, lang: string): Promise<FreqWord[]> {
  const wordRank = new Map<string, number>()
  const fileStream = fs.createReadStream(fileIn)
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  })

  for await (const line of rl) {
    const [, country, text] = line.split('\t')
    if (country != lang) continue
    const words = wordTokenizer(cleanString(text))
    words.forEach((x) => {
      if (!x) return
      wordRank.set(x, (wordRank.get(x) || 0) + 1)
    })
  }

  const values = [...wordRank.entries()]

  return values.map((x) => {
    return { word: x[0], count: x[1] } as FreqWord
  })
}

export async function processFrequencyLineByLine(fileIn: string): Promise<FreqWord[]> {
  const wordRank = new Map<string, number>()

  const fileStream = fs.createReadStream(fileIn)
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  })

  for await (const line of rl) {
    const [text, count] = line.split(' ')
    const str = cleanString(text)
    if (!str || str.startsWith("'")) continue
    wordRank.set(str, parseInt(count))
  }

  const values = [...wordRank.entries()]
  return values.map((x) => {
    return { word: x[0], count: x[1] } as FreqWord
  })
}
