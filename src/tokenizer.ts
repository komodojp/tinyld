import { cleanString, normalize } from './clean'
import { approximate, DetectOption, ILangProfiles, langs, toISO2, TRAINING_UNIQUE_GRAMS } from './core'

const chunk_regexp = /[.,，、。!¿?！？":;()「」{}„“«»”"“<>⋯《》*]+/
const word_regexp = /[ ]+/

export function chunkTokenizer(text: string): string[] {
  return text.split(chunk_regexp)
}

export function wordTokenizer(text: string): string[] {
  return text.split(word_regexp)
}

export function ngramTokenizer(text: string, length: number, padding = true): string[] {
  const ngramsArray = []
  const array = padding ? ' '.repeat(length - 1) + text + ' '.repeat(length - 1) : text

  for (let i = 0; i < array.length - (length - 1); i++) {
    const subNgramsArray = []

    let consecutiveSpace = 0
    for (let j = 0; j < length; j++) {
      if (array[i + j] === ' ') consecutiveSpace += 1
      else consecutiveSpace = 0
      if (consecutiveSpace > 1) continue
      subNgramsArray.push(array[i + j])
    }

    const str = subNgramsArray.join('')
    if (str.trim().length > 0 && str.length === length) ngramsArray.push(str)
  }

  return ngramsArray
}

export function detectUniqueGrams(
  text: string,
  profiles: ILangProfiles,
  keys: Set<string>,
  options: DetectOption
): string {
  for (const rank of TRAINING_UNIQUE_GRAMS) {
    const grams = ngramTokenizer(text, rank)
    if (options.verbose) console.log(`[Pass 1] detectUniqueGrams of ${rank}-grams`, grams)
    for (const gram of grams) {
      if (!keys.has(gram)) continue

      const country = toISO2(profiles.uniques[gram])
      if (options.only.length > 0) {
        if (!options.only.includes(country)) continue
      }
      if (options.verbose) console.log(`- match '${gram}' to ${country}`)
      return country
    }
  }
  return ''
}

export function detectPotentialGrams(text: string, profiles: ILangProfiles, options: DetectOption): string {
  const res = detectStatsGrams(text, profiles, options)
  if (res.length > 0) return res[0].lang
  return ''
}

export function detectStatsGrams(
  text: string,
  profiles: ILangProfiles,
  options: DetectOption
): { lang: string; accuracy: number }[] {
  const langScores = new Map<string, number>()

  const grams = TRAINING_UNIQUE_GRAMS.map((x) => ngramTokenizer(text, x)).flat()
  if (options.verbose) console.log('[Pass 2] DetectPotentialGrams', text, grams)
  const langSet = new Set(
    [...langs.values()].filter((x) => {
      if (options.only.length > 0) return options.only.includes(x) || options.only.includes(toISO2(x))
      return true
    })
  )

  langSet.forEach((x) => langScores.set(x, 0))
  for (const gramValue of grams) {
    const gram = normalize(gramValue)
    const gramStat = profiles.multiples[gram]
    if (!gramStat) continue

    const gramLangs = new Set(Object.keys(gramStat))
    const debug: string[] = []
    for (const lang of langSet) {
      if (gramLangs.has(lang)) {
        langScores.set(lang, (langScores.get(lang) || 0) + (gramStat[lang] * gram.length) / 4)
        debug.push(`${lang} = ${(gramStat[lang] / 1024) * 100}%`)
      }
    }
    if (options.verbose && debug.length > 0) console.log(`Gram '${gram}'`, debug)
  }

  const entries = [...langScores.entries()]
  entries.sort((a, b) => b[1] - a[1])
  const max = Math.max(...entries.map((x) => x[1])) || 1
  const result = entries.slice(0, 8).map((x) => {
    return {
      lang: toISO2(x[0]),
      accuracy: 1 - approximate((max - x[1]) / max),
      score: approximate(x[1])
    }
  })
  if (options.verbose) console.log(`Result`, text, result)
  return result
}

export function detectAllStats(
  text: string,
  options: DetectOption,
  profiles: ILangProfiles,
  uniqueKeys: Set<string>
): { lang: string; accuracy: number }[] {
  let chunks = chunkTokenizer(text)
  chunks = chunks.map((x) => cleanString(x)).filter((x) => !!x)
  chunks.sort((a, b) => b.length - a.length)
  chunks = chunks.slice(0, 7)

  let size = 0
  const results: { [lang: string]: number } = {}
  for (const chunk of chunks) {
    // pass 1 - unique character detection
    const res = detectUniqueGrams(chunk, profiles, uniqueKeys, options)
    if (res) {
      results[res] = (results[res] || 0) + 1 * chunk.length
      size += chunk.length
      continue
    }

    const words = wordTokenizer(chunk)
    for (const word of words) {
      // pass 2 - statistical 3-gram analysis
      const res2 = detectStatsGrams(word, profiles, options)
      res2.forEach((x) => {
        results[x.lang] = (results[x.lang] || 0) + x.accuracy
      })
      size += word.length
    }
  }

  // merge result
  const entries = Object.entries(results).filter((x) => x[1] > 0)
  entries.sort((a, b) => b[1] - a[1])
  const result = entries.map((x) => {
    return { lang: x[0], accuracy: x[1] / size }
  })
  if (options.verbose) console.log('Merge Results', result)
  return result
}
