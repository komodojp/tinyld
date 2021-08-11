import { approximate, DetectOption, ILangProfiles, langs, toISO2, TRAINING_UNIQUE_GRAMS } from './core'

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
  const res = detectAllPotentialGrams(text, profiles, options)
  if (res.length > 0) return res[0].lang
  return ''
}

export function detectAllPotentialGrams(
  text: string,
  profiles: ILangProfiles,
  options: DetectOption
): { lang: string; accuracy: number }[] {
  const langScores = new Map<string, number>()

  const grams = ngramTokenizer(text, 3)
  if (options.verbose) console.log('[Pass 2] DetectPotentialGrams', text, grams)
  const langSet = new Set(
    [...langs.values()].filter((x) => {
      if (options.only.length > 0) return options.only.includes(x) || options.only.includes(toISO2(x))
      return true
    })
  )

  langSet.forEach((x) => langScores.set(x, 0))
  for (const gram of grams) {
    const gramStat = profiles.multiples[gram]
    if (!gramStat) continue

    const gramLangs = new Set(Object.keys(gramStat))
    const debug: string[] = []
    for (const lang of langSet) {
      if (gramLangs.has(lang)) {
        langScores.set(lang, (langScores.get(lang) || 0) + 500 * (1 - gramStat[lang]))
        debug.push(`${lang} = ${gramStat[lang] * 100}%`)
      } else {
        langScores.set(lang, (langScores.get(lang) || 0) + 750)
      }
    }
    if (options.verbose && debug.length > 0) console.log(`Gram '${gram}'`, debug)
  }

  const entries = [...langScores.entries()]
  entries.sort((a, b) => a[1] - b[1])
  const max = Math.max(...entries.map((x) => x[1]))
  const result = entries.slice(0, 5).map((x) => {
    return {
      lang: toISO2(x[0]),
      accuracy: approximate((max - x[1]) / max),
      score: approximate(x[1])
    }
  })
  if (options.verbose) console.log(`Result`, text, result)
  return result
}
