import fs from 'fs'
import readline from 'readline'
import { ngramTokenizer } from './tokenizer'
import { processSentencesLineByLine } from './train/splitter'
import pLimit from 'p-limit'
import {
  configSet,
  getLangTopStatsGram,
  isSkipProba,
  langs,
  langToId,
  supportedLanguages,
  TOP_LANGUAGE_UNIQUE_GRAMS,
  TRAINING_UNIQUE_GRAMS
} from './core'

const banWordList = new Set(['tatoeba', 'facebook', 'tom', '=', '-', '﹣'])

async function processLang(lang: string) {
  const wordRank = new Map<string, number>()
  if (!fs.existsSync(`data/tmp`)) fs.mkdirSync(`data/tmp`)
  if (!fs.existsSync(`data/tmp/${lang}`)) fs.mkdirSync(`data/tmp/${lang}`)

  if (!fs.existsSync(`data/tmp/${lang}/sentences.txt`)) {
    console.log(`Create ${lang} sentences.txt`)
    const fileStream = fs.createReadStream('data/tatoeba.csv')
    const writeStream = fs.createWriteStream(`data/tmp/${lang}/sentences.txt`, { flags: 'a' })
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    })

    for await (const line of rl) {
      const [, country, text] = line.split('\t')
      if (country != lang) continue
      writeStream.write(`${text}\n`)
    }

    if (fs.existsSync(`data/udhr/udhr_${lang}.txt`)) {
      const udhrFileStream = fs.createReadStream(`data/udhr/udhr_${lang}.txt`)
      const rl2 = readline.createInterface({
        input: udhrFileStream,
        crlfDelay: Infinity
      })
      let useLine = false
      for await (const line of rl2) {
        if (line === '---') {
          useLine = true
          continue
        }
        if (!useLine) continue
        if (!line.trim() || line.length < 24) continue
        writeStream.write(`${line.trim()}\n`)
      }
    }

    writeStream.close()
    rl.close()
  }

  if (!fs.existsSync(`data/tmp/${lang}/words.txt`)) {
    console.log(`Create ${lang} words.txt`)

    // parse sentences file
    const res = await processSentencesLineByLine(`data/tmp/${lang}/sentences.txt`)
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

    for (const gram of [1, 2, 3, 4, 5]) {
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
  for (let i = 1; i < gram; i++) {
    const grams = ngramTokenizer(txt, i)
    if (grams.some((x) => uniques.has(x))) return true
  }
  return false
}

async function processUniqueGrams(langs: string[], gram: number, uniques: Set<string>) {
  const map = new Map<string, Map<string, { count: number; index: number }>>()
  for (const lang of langs) {
    // console.log('process Gram', lang, gram)
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

async function processLangGrams(langs: string[], gram: number, uniques: Set<string>) {
  const allGrams = new Map<string, string[]>()
  for (const lang of langs) {
    if (isSkipProba(lang)) continue
    const fileStream = fs.createReadStream(`data/tmp/${lang}/${gram}-gram.txt`)
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    })
    for await (const line of rl) {
      const [txt] = line.split('\t')
      if (txt in uniques) continue
      allGrams.set(txt, [...(allGrams.get(txt) || []), txt])
    }
    fileStream.close()
  }

  const grams = new Set()
  for (const lang of langs) {
    if (isSkipProba(lang)) continue
    const fileStream = fs.createReadStream(`data/tmp/${lang}/${gram}-gram.txt`)
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    })

    let normal = getLangTopStatsGram(lang)
    for await (const line of rl) {
      const [txt] = line.split('\t')
      if (txt in uniques) continue
      if ((allGrams.get(txt)?.length || 0) > 12) continue

      grams.add(txt)
      normal--
      if (normal <= 0) break
    }
    fileStream.close()
  }

  const langGrams = new Map<string, Record<string, number>>()
  for (const lang of langs) {
    if (isSkipProba(lang)) continue
    const fileStream = fs.createReadStream(`data/tmp/${lang}/${gram}-gram.txt`)
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    })

    for await (const line of rl) {
      const [txt, usage] = line.split('\t')
      const value = parseFloat(usage)
      if (!grams.has(txt)) continue
      const data = langGrams.get(txt) || {}
      const rnd = Math.round(1024 * (1 - (1 - value) * (1 - value)))
      if (rnd <= 1) break
      data[lang] = rnd
      langGrams.set(txt, data)
    }
    fileStream.close()
  }

  return Object.fromEntries(langGrams.entries())
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sortKeys(_key: string, value: any) {
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
  const processLangs = [...langs.values()]

  const limit = pLimit(4)

  await Promise.all(
    processLangs.map((lang) => {
      return limit(() => processLang(lang))
    })
  )

  let uniques: Record<string, string> = {}
  for (const gram of TRAINING_UNIQUE_GRAMS) {
    const un = new Set([...Object.keys(uniques)])
    uniques = { ...uniques, ...(await processUniqueGrams(processLangs, gram, un)) }
  }

  let multiples: Record<string, Record<string, number>> = {}
  for (const gram of TRAINING_UNIQUE_GRAMS) {
    const un = new Set([...Object.keys(uniques)])
    multiples = { ...multiples, ...(await processLangGrams(processLangs, gram, un)) }
  }

  fs.writeFileSync(
    `src/profiles/${configSet}.json`,
    JSON.stringify(
      {
        id: 'tinyld-dict',
        uniques: Object.fromEntries(
          Object.entries(uniques).map((x) => {
            const val = langToId[x[1]].toString(36)
            return [x[0], isNaN(val as unknown as number) ? val : parseInt(val)]
          })
        ),
        multiples: Object.fromEntries(
          Object.entries(multiples).map((x) => {
            let str = ''
            Object.entries(x[1]).forEach((y) => {
              const country = langToId[y[0]].toString(36).padStart(supportedLanguages.length > 36 ? 2 : 1, '0')
              const value = y[1].toString(36).padStart(2, '0')
              str += `${country.toUpperCase()}${value.toUpperCase()}`
            })
            return [x[0], str]
          })
        )
      },
      sortKeys,
      2
    )
  )

  console.log('End')
}

processFiles()
