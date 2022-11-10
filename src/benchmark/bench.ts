import fs from 'fs'
import readline from 'readline'
import { approximate, getCoef, langs, langName, toISO2 } from '../core'

type DetectMethod = (val: string) => Promise<string> | string

export type BenchmarkResult = {
  size: Record<string, BenchmarkSize>
  stats: {
    min: number
    max: number
    success_rate: number
    error_rate: number
    unindentified_rate: number
    execution_time: number
  }
  languages: Record<string, number>
}

type BenchmarkSize = { success_rate: number; error_rate: number; unindentified_rate: number; execution_time: number }
type CountPerSize = {
  min: number
  max: number
  buffer: string
  total: number
  success: number
  error: number
  unidentified: number
  exec: number
}

const benchLangs = new Set([
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

export async function benchmark(detect: DetectMethod): Promise<BenchmarkResult> {
  const total = new Map<string, number>()
  const success = new Map<string, number>()
  let detectTotal = 0
  let detectIdentified = 0
  let detectUnidentified = 0
  let detectMistake = 0
  let executionTime = 0

  const countCategories = [
    { min: 0, max: 10 },
    { min: 10, max: 16 },
    { min: 16, max: 24 },
    { min: 24, max: 36 },
    { min: 36, max: 48 },
    { min: 48, max: 64 },
    { min: 64, max: 128 },
    { min: 128, max: 256 },
    { min: 256, max: 512 },
    { min: 512, max: 1024 }
  ]

  const globalCount: Record<number, BenchmarkSize> = Object.fromEntries(
    countCategories.map((x) => [x.max, { success_rate: 0, error_rate: 0, unindentified_rate: 0, execution_time: 0 }])
  )

  const errorMap = new Map<string, number>()

  for (const country of benchLangs.values()) {
    const fileStream = fs.createReadStream(`data/tmp/${country}/sentences.txt`)
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    })

    let line = 0

    const langCount: Record<string, CountPerSize> = Object.fromEntries(
      countCategories.map((x) => [
        x.max,
        { min: x.min, max: x.max, buffer: '', total: 0, success: 0, error: 0, unidentified: 0, exec: 0 }
      ])
    )

    for await (const text of rl) {
      if (text.length < 16) continue
      line += 1
      if (line > 10000) break

      total.set(country, (total.get(country) || 0) + 1)
      detectTotal += 1

      const start = process.hrtime()
      const res = await detect(text)
      const duration = process.hrtime(start)[1] / 1000000
      executionTime += duration

      if (res === '') {
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

    fileStream.close()

    const fileStream2 = fs.createReadStream(`data/tmp/${country}/sentences.txt`)
    const rl2 = readline.createInterface({
      input: fileStream2,
      crlfDelay: Infinity
    })

    for await (const text of rl2) {
      for (const size of countCategories.map((x) => x.max)) {
        if (langCount[size].buffer.length + text.length < langCount[size].max) {
          if (langCount[size].buffer) {
            langCount[size].buffer += `. ${text}`
          } else {
            langCount[size].buffer = text
          }

          continue
        }

        if (
          langCount[size].buffer &&
          langCount[size].total < 200 &&
          langCount[size].buffer.length >= langCount[size].min &&
          langCount[size].buffer.length <= langCount[size].max
        ) {
          const start = process.hrtime()
          const res = await detect(langCount[size].buffer)
          const duration = process.hrtime(start)[1] / 1000000
          langCount[size].exec += duration
          if (res === '') {
            langCount[size].unidentified += 1
          } else if (res === toISO2(country)) {
            langCount[size].success += 1
          } else {
            langCount[size].error += 1
          }
          langCount[size].total += 1
        }

        langCount[size].buffer = ''
      }
    }

    fileStream2.close()

    for (const size of countCategories.map((x) => x.max)) {
      globalCount[size].success_rate += langCount[size].success
      globalCount[size].error_rate += langCount[size].error
      globalCount[size].unindentified_rate += langCount[size].unidentified
      globalCount[size].execution_time += langCount[size].exec
    }
  }

  for (const size of countCategories.map((x) => x.max)) {
    const entry = globalCount[size]
    const cpt = entry.success_rate + entry.error_rate + entry.unindentified_rate

    entry.success_rate = approximate((entry.success_rate / cpt) * 100)
    entry.error_rate = approximate((entry.error_rate / cpt) * 100)
    entry.unindentified_rate = approximate((entry.unindentified_rate / cpt) * 100)
    entry.execution_time = approximate(entry.execution_time / cpt)
  }

  console.log(`--- Per language Accuracy ---`)
  const languageAccuracy: [string, number][] = []
  const acc: [number, string][] = []
  for (const lang of total.keys()) {
    const s = success.get(lang) || 1
    const t = total.get(lang) || 1
    acc.push([s / t, ` - ${langName(lang)} (${lang}) - ${approximate((s / t) * 100)}% (coef: ${getCoef(lang)})`])
    languageAccuracy.push([lang, approximate((s / t) * 100)])
  }
  acc.sort((a, b) => b[0] - a[0])
  languageAccuracy.sort((a, b) => b[1] - a[1])
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

  return {
    size: globalCount,
    stats: {
      min: Math.min(...languageAccuracy.map((x) => x[1])),
      max: Math.max(...languageAccuracy.map((x) => x[1])),
      success_rate: approximate((detectIdentified / detectTotal) * 100),
      error_rate: approximate((detectMistake / detectTotal) * 100),
      unindentified_rate: approximate((detectUnidentified / detectTotal) * 100),
      execution_time: approximate(executionTime / detectTotal)
    },
    languages: Object.fromEntries(languageAccuracy)
  }
}
