import fs from 'fs'
import readline from 'readline'
import { langName } from '..'
import { approximate, getCoef, langs, toISO2 } from '../core'

const readInterface = readline.createInterface({
  input: fs.createReadStream('data/tatoeba.csv')
})

type DetectMethod = (val: string) => Promise<string> | string

const benchLangs = /* langs */ new Set([
  'jpn',
  'cmn',
  'kor',
  'hin',
  'nld',
  'fra',
  'eng',
  'deu',
  'spa',
  'por',
  'ita',
  'fin',
  'rus',
  'tur',
  'heb',
  'ara'
])

export async function benchmark(detect: DetectMethod): Promise<void> {
  const total = new Map<string, number>()
  const success = new Map<string, number>()
  let detectTotal = 0
  let detectIdentified = 0
  let detectUnidentified = 0
  let detectMistake = 0
  let executionTime = 0

  const countryCheck = new Map<string, number>()
  const errorMap = new Map<string, number>()

  for await (const line of readInterface) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [, country, text] = line.split('\t')

    if (!benchLangs.has(country)) continue
    if ((countryCheck.get(country) || 0) > 7500) continue
    countryCheck.set(country, (countryCheck.get(country) || 0) + 1)

    total.set(country, (total.get(country) || 0) + 1)
    detectTotal += 1

    const start = process.hrtime()
    const res = await detect(text)
    const duration = process.hrtime(start)[1] / 1000000
    executionTime += duration

    if (res === '') {
      // console.log('No unique property detected', id, text, res)
      detectUnidentified += 1
    } else if (res === toISO2(country)) {
      success.set(country, (success.get(country) || 0) + 1)
      detectIdentified += 1
    } else {
      detectMistake += 1
      const errorKey = `${toISO2(country)} -> ${res}`
      errorMap.set(errorKey, (errorMap.get(errorKey) || 0) + 1)
    }
  }

  console.log(`--- Per language Accuracy ---`)
  const acc: [number, string][] = []
  for (const lang of total.keys()) {
    const s = success.get(lang) || 1
    const t = total.get(lang) || 1
    acc.push([s / t, ` - ${langName(lang)} (${lang}) - ${approximate((s / t) * 100)}% (coef: ${getCoef(lang)})`])
  }
  acc.sort((a, b) => b[0] - a[0])
  acc.forEach((x) => console.log(x[1]))

  const errors = [...errorMap.entries()]
  errors.sort((a, b) => b[1] - a[1])
  console.log(
    `\n--- More common errors (${
      Math.round((detectMistake / detectTotal) * 100 * 100) / 100
    }% : ${detectMistake} / ${detectTotal}) ---`
  )
  console.log(
    errors
      .map((x) => ` - ${x[0]} : ${approximate((100 * x[1]) / detectMistake)}% (error: ${x[1]})`)
      .slice(0, 20)
      .join('\n')
  )

  console.log(`\n--- Summary (${langs.size} languages) ---`)
  console.log(` - Properly identified: ${approximate((detectIdentified / detectTotal) * 100)}%`)
  console.log(` - Improperly identified: ${approximate((detectMistake / detectTotal) * 100)}%`)
  console.log(` - Unidentified: ${approximate((detectUnidentified / detectTotal) * 100)}%`)
  console.log(` - Avg exec time: ${approximate(executionTime / detectTotal)}ms.`)
}
