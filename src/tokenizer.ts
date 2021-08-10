import { approximate, ILangProfiles, langs, toISOLocale, TRAINING_UNIQUE_GRAMS } from './core'

export function ngramTokenizer(text: string, length: number, padding = true): string[] {
  const ngramsArray = []
  const array = padding ? ' '.repeat(length - 1) + text + ' '.repeat(length - 1) : text

  for (let i = 0; i < array.length - (length - 1); i++) {
    const subNgramsArray = []

    for (let j = 0; j < length; j++) {
      subNgramsArray.push(array[i + j])
    }

    const str = subNgramsArray.join('')
    if (str.trim().length > 0) ngramsArray.push(str)
  }

  return ngramsArray
}

export function detectUniqueGrams(text: string, profiles: ILangProfiles): string {
  for (const rank of TRAINING_UNIQUE_GRAMS) {
    const grams = ngramTokenizer(text, rank)
    for (const gram of grams) {
      if (gram in profiles.uniques) return toISOLocale(profiles.uniques[gram])
    }
  }
  return ''
}

export function detectPotentialGrams(text: string, profiles: ILangProfiles): string {
  const res = detectAllPotentialGrams(text, profiles, false)
  if (res.length > 0) return res[0].lang
  return ''
}

export function detectAllPotentialGrams(
  text: string,
  profiles: ILangProfiles,
  verbose: boolean
): { lang: string; accuracy: number }[] {
  const langScores = new Map<string, number>()

  const grams = ngramTokenizer(text, 3)
  if (verbose) console.log('DetectPotentialGrams', text, grams)
  const langSet = new Set([...langs.keys()])

  langSet.forEach((x) => langScores.set(x, 0))
  for (const gram of grams) {
    const gramStat = profiles.multiples[gram]
    if (!gramStat) continue

    const gramLangs = new Set(Object.keys(gramStat))
    const debug: string[] = []
    for (const lang of langs) {
      if (gramLangs.has(lang)) {
        langScores.set(lang, (langScores.get(lang) || 0) + 500 * (1 - gramStat[lang]))
        debug.push(`${lang} = ${gramStat[lang] * 100}%`)
      } else {
        langScores.set(lang, (langScores.get(lang) || 0) + 750)
      }
    }
    if (verbose && debug.length > 0) console.log(`Gram '${gram}'`, debug)
  }

  const entries = [...langScores.entries()]
  entries.sort((a, b) => a[1] - b[1])
  const max = Math.max(...entries.map((x) => x[1]))
  const result = entries.slice(0, 5).map((x) => {
    return {
      lang: toISOLocale(x[0]),
      accuracy: approximate((max - x[1]) / max),
      score: approximate(x[1])
    }
  })
  if (verbose) console.log(`Result`, text, result)
  return result
}
