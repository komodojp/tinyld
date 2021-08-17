import fs from 'fs'
import readline from 'readline'
import { ngramTokenizer } from './tokenizer'
import { processTatoebaLineByLine } from './train/splitter'
import pLimit from 'p-limit'
import { normalize } from './clean'
import {
  configSet,
  isSkipProba,
  langs,
  TOP_GRAM,
  TOP_GRAM_MAXLANG,
  TOP_LANGUAGE_UNIQUE_GRAMS,
  TOP_WORD,
  TOP_WORD_MAXLANG,
  TRAINING_UNIQUE_GRAMS
} from './core'

const banWordList = new Set(['tatoeba', 'facebook', 'tom', '=', '-', '﹣'])

async function processLang(lang: string) {
  const wordRank = new Map<string, number>()
  if (!fs.existsSync(`data/tmp`)) fs.mkdirSync(`data/tmp`)
  if (!fs.existsSync(`data/tmp/${lang}`)) fs.mkdirSync(`data/tmp/${lang}`)

  if (!fs.existsSync(`data/tmp/${lang}/words.txt`)) {
    // if (files[lang].freq) {
    //   const res = await processFrequencyLineByLine(files[lang].freq as string)
    //   res.forEach(x => wordRank.set(x.word, (wordRank.get(x.word) || 0) + x.count))
    // }

    // parse tatoeba file
    const res = await processTatoebaLineByLine('data/tatoeba.csv', lang)
    res.forEach((x) => wordRank.set(x.word, (wordRank.get(x.word) || 0) + x.count))

    // words
    const wordOutStream = fs.createWriteStream(`data/tmp/${lang}/words.txt`, { flags: 'a' })
    const values = [...wordRank.entries()]
    values.sort((a, b) => b[1] - a[1])
    const wordMax = values[0][1]
    values.forEach((x) => {
      if (x[1] < 10 || x[1] / wordMax < 0.00001) return
      if (banWordList.has(x[0])) return
      wordOutStream.write(`${x[0]}\t${x[1] / wordMax}\n`)
    })
    wordOutStream.close()

    for (const gram of [1, 2, 3, 4]) {
      const gramRank = new Map<string, number>()

      for (const word of wordRank.keys()) {
        const count = wordRank.get(word) || 0

        ngramTokenizer(word, gram).forEach((x) => {
          gramRank.set(x, (gramRank.get(x) || 0) + count)
        })
      }

      const gramOutStream = fs.createWriteStream(`data/tmp/${lang}/${gram}-gram.txt`, { flags: 'a' })
      const gramValues = [...gramRank.entries()]
      gramValues.sort((a, b) => b[1] - a[1])
      const max = gramValues[0][1]
      gramValues.forEach((x) => {
        if (x[1] < 10 || x[1] / max < 0.00001) return
        gramOutStream.write(`${x[0]}\t${x[1] / max}\n`)
      })
      gramOutStream.close()
    }
  }
}

const checkNgramContains = (txt: string, gram: number, uniques: Set<string>) => {
  for (let i = 1; i < gram - 1; i++) {
    const grams = ngramTokenizer(txt, i)
    if (grams.some((x) => uniques.has(x))) return true
  }
  return false
}

async function processUniqueGrams(langs: string[], gram: number, uniques: Set<string>) {
  const map = new Map<string, Map<string, { count: number; index: number }>>()
  for (const lang of langs) {
    console.log('process Gram', lang, gram)
    const fileStream = fs.createReadStream(`data/tmp/${lang}/${gram}-gram.txt`)
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    })
    let index = 0
    for await (const line of rl) {
      const [txt, usage] = line.split('\t')
      if (banWordList.has(txt)) continue
      if (checkNgramContains(txt, gram, uniques)) continue
      if (!map.has(txt)) map.set(txt, new Map())

      const gramData = map.get(txt) as Map<string, { count: number; index: number }>
      gramData.set(lang, { count: parseFloat(usage), index })
      index++
    }
    fileStream.close()
  }

  const uniqueMap = new Map<string, [number, string][]>()
  ;[...map.entries()].forEach((gram) => {
    if (gram[1].size !== 1) return
    const txt = gram[0]
    const country = [...gram[1].keys()][0]
    const index = gram[1].get(country)?.index || 0
    if (!uniqueMap.has(country)) uniqueMap.set(country, [])
    uniqueMap.get(country)?.push([index, txt])
  })

  const result: { [id: string]: string } = {}
  ;[...uniqueMap.entries()].forEach((x) => {
    let count = 0
    x[1].forEach((y) => {
      if (count > TOP_LANGUAGE_UNIQUE_GRAMS) return
      count++
      result[y[1]] = x[0]
    })
  })

  return result
}

async function processStatsWords(langs: string[], uniques: Set<string>) {
  const map = new Map<string, Map<string, { count: number; index: number }>>()
  for (const lang of langs) {
    if (isSkipProba(lang)) continue
    console.log('process Words', lang)
    const fileStream = fs.createReadStream(`data/tmp/${lang}/words.txt`)
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    })
    let index = 0
    for await (const line of rl) {
      const [text, usage] = line.split('\t')
      const txt = normalize(text)
      if (uniques.has(txt)) continue
      if (banWordList.has(txt)) continue
      if (checkNgramContains(txt, 4, uniques)) continue
      if (!map.has(txt)) map.set(txt, new Map())
      if (txt.length > 8) continue

      const gramData = map.get(txt) as Map<string, { count: number; index: number }>
      gramData.set(lang, { count: parseFloat(usage), index })
      index++
    }
    fileStream.close()
  }

  const result: { [gram: string]: { [country: string]: number } } = {}

  ;[...map.entries()].forEach((gram) => {
    if (gram[1].size > TOP_WORD_MAXLANG) return

    const txt = gram[0]
    ;[...gram[1].entries()].forEach((entry) => {
      if (entry[1].count * 100000 < 500) return
      if (entry[1].index > TOP_WORD) return
      if (!result[txt]) result[txt] = {}
      const val = 1 - (1 - entry[1].count) * (1 - entry[1].count)
      result[txt][entry[0]] = Math.round(val * 100000)
    })
  })

  return result
}

async function processStatsGrams(langs: string[], gram: number, uniques: Set<string>) {
  const map = new Map<string, Map<string, { count: number; index: number }>>()
  for (const lang of langs) {
    if (isSkipProba(lang)) continue
    console.log('process Stats Gram', lang, gram)
    const fileStream = fs.createReadStream(`data/tmp/${lang}/${gram}-gram.txt`)
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    })
    let index = 0
    for await (const line of rl) {
      const [text, usage] = line.split('\t')
      const txt = normalize(text)
      if (banWordList.has(txt)) continue
      if (checkNgramContains(txt, gram, uniques)) continue
      if (uniques.has(txt)) continue
      if (!map.has(txt)) map.set(txt, new Map())

      const gramData = map.get(txt) as Map<string, { count: number; index: number }>
      gramData.set(lang, { count: parseFloat(usage), index })
      index++
    }
    fileStream.close()
  }

  const result: { [gram: string]: { [country: string]: number } } = {}

  ;[...map.entries()].forEach((gram) => {
    if (gram[1].size > TOP_GRAM_MAXLANG) return

    const txt = gram[0]
    ;[...gram[1].entries()].forEach((entry) => {
      if (entry[1].count * 100000 < 500) return
      if (entry[1].index > TOP_GRAM) return
      if (!result[txt]) result[txt] = {}
      const val = 1 - (1 - entry[1].count) * (1 - entry[1].count)
      result[txt][entry[0]] = Math.round(val * 100000)
    })
  })

  return result
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sortKeys(key: string, value: any) {
  if (value == null || value.constructor != Object) {
    return value
  }

  return (
    Object.keys(value)
      .sort()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .reduce((s: any, k: any) => {
        s[k] = value[k]
        return s
      }, {})
  )
}

async function processFiles() {
  console.log('Start')
  const processLangs = [...langs.values()]

  const limit = pLimit(4)

  await Promise.all(
    processLangs.map((lang) => {
      return limit(() => {
        console.log('Extract', lang)
        return processLang(lang)
      })
    })
  )

  let uniques = {}
  for (const gram of TRAINING_UNIQUE_GRAMS) {
    uniques = { ...uniques, ...(await processUniqueGrams(processLangs, gram, new Set([...Object.keys(uniques)]))) }
  }

  const words = {
    ...(await processStatsWords(processLangs, new Set(Object.keys(uniques))))
  }

  let multiples = {}
  for (const gram of [4]) {
    multiples = {
      ...multiples,
      ...(await processStatsGrams(processLangs, gram, new Set([...Object.keys(uniques), ...Object.keys(words)])))
    }
  }

  fs.writeFileSync(
    `src/profiles/${configSet}.json`,
    JSON.stringify(
      {
        id: 'tinyld-dict',
        uniques,
        multiples,
        words
      },
      sortKeys,
      2
    )
  )

  console.log('End')
}

processFiles()
