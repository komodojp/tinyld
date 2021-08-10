import fs from 'fs'
import { cleanString, normalize } from './clean'
import {
  approximate,
  ILangProfiles,
  langs,
  DATASET_MAX_LINE_PER_LANGUAGE,
  TOP_LANGUAGE_GRAMS,
  TOP_LANGUAGE_UNIQUE_GRAMS,
  TRAINING_UNIQUE_GRAMS,
  isSkipProba,
  isExtraSample,
  DB_PROFILE_PATH,
  configSet,
  TOP_LANGUAGE_GRAMS_MAXLANG
} from './core'
import { ngramTokenizer } from './tokenizer'

interface NGram {
  country: string
  text: string
  usage: number
}

interface NGramLocale {
  countries: Set<string>
  text: string
  usage: number
}

interface NGramByLength {
  gramByLocale: Map<string, Map<string, NGram>>
  gramAllLocale: Map<string, NGramLocale>
  nonSpecific: Set<string>
}

const langTexts = new Map<string, number>()
const gramData: { [id: string]: NGramByLength } = {
  '1': { gramByLocale: new Map(), gramAllLocale: new Map(), nonSpecific: new Set() },
  '2': { gramByLocale: new Map(), gramAllLocale: new Map(), nonSpecific: new Set() },
  '3': { gramByLocale: new Map(), gramAllLocale: new Map(), nonSpecific: new Set() },
  '4': { gramByLocale: new Map(), gramAllLocale: new Map(), nonSpecific: new Set() },
  '5': { gramByLocale: new Map(), gramAllLocale: new Map(), nonSpecific: new Set() }
}

console.log(`[TinyLD] Training - Start ${configSet}`)
const file = fs.readFileSync('data/tatoeba.csv', 'utf-8')
const fileExtra = fs.readFileSync('data/extra-sentences.csv', 'utf-8')
const lines = [...fileExtra.split('\n'), ...file.split('\n')]

console.log('[TinyLD] Training - Parsing Dataset files')
for (const line of lines) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_id, country, text] = line.split('\t')
  if (!langs.has(country)) continue
  const lines = langTexts.get(country) || 0
  if (lines > DATASET_MAX_LINE_PER_LANGUAGE) continue
  langTexts.set(country, lines + 1)

  // clean and tokenize
  const cleanText = cleanString(text)
  for (const gramLength of TRAINING_UNIQUE_GRAMS) {
    const { gramByLocale, gramAllLocale } = gramData[gramLength.toString()]
    const grams = ngramTokenizer(cleanText, gramLength)
    if (!gramByLocale.has(country)) gramByLocale.set(country, new Map())

    // index
    const gramMap = gramByLocale.get(country) as Map<string, NGram>
    for (const gram of grams) {
      const value = gramMap.get(gram) || { country, text: gram, usage: 0 }
      value.usage++
      gramMap.set(gram, value)

      const value2 = gramAllLocale.get(gram) || { countries: new Set(), text: gram, usage: 0 }
      value2.countries.add(country)
      value2.usage++
      gramAllLocale.set(gram, value2)
    }
  }
}

for (const gramId of TRAINING_UNIQUE_GRAMS.map((x) => x.toString())) {
  const locales = [...gramData[gramId].gramAllLocale.values()]
  locales
    .filter((x) => x.countries.size > 1)
    .map((x) => x.text)
    .forEach((x) => gramData[gramId].nonSpecific.add(x))
}

const profiles: ILangProfiles = {
  uniques: {},
  multiples: {}
}

for (const country of langs) {
  console.log(`[TinyLD] Training - Process Lang ${country}`)
  const currentCountryGrams = new Set<string>()
  for (const gramLength of TRAINING_UNIQUE_GRAMS) {
    const { gramByLocale, nonSpecific } = gramData[gramLength.toString()]
    const countryGrams = [...(gramByLocale.get(country)?.values() || [])] as NGram[]

    // remove non specific
    let uniqueCountryGrams = countryGrams.filter((x) => !nonSpecific.has(x.text))

    // save unique grams
    // remove already cover by lower rank grams
    uniqueCountryGrams = uniqueCountryGrams.filter((x) => {
      if (gramLength > 1) {
        for (let i = 1; i <= gramLength - 1; i++) {
          if (ngramTokenizer(x.text, i, false).some((y) => currentCountryGrams.has(y))) {
            return false
          }
        }
      }
      return true
    })
    uniqueCountryGrams.sort((a, b) => b.usage - a.usage)
    uniqueCountryGrams = uniqueCountryGrams.slice(0, TOP_LANGUAGE_UNIQUE_GRAMS)
    uniqueCountryGrams.forEach((x) => currentCountryGrams.add(x.text))
    const uniques = uniqueCountryGrams.map((x) => x.text)
    uniques.forEach((x) => {
      profiles.uniques[x] = country
    })
    const countryUniques = new Set(uniques)
    // console.log(`Unique ${country} - ${gramLength} - ${uniques.length}`)

    // save non unique 3-grams
    if (gramLength != 3) continue
    if (isSkipProba(country)) continue
    const values = [...countryGrams].filter((x) => !countryUniques.has(x.text))
    values.forEach((x) => (x.text = normalize(x.text)))
    values.sort((a, b) => b.usage - a.usage)

    const entries = values.slice(0, isExtraSample(country) ? 2 * TOP_LANGUAGE_GRAMS : TOP_LANGUAGE_GRAMS)
    entries.forEach((gram: NGram) => {
      if (!profiles.multiples[gram.text]) profiles.multiples[gram.text] = {}
      profiles.multiples[gram.text][country] = gram.usage
    })
    // console.log(`Probability ${country} - ${entries.length}`)
  }
}

console.log(`[TinyLD] Training - Cleanup output`)
// remove gram with too many language (lot of space and not specific enough)
for (const id of Object.keys(profiles.multiples)) {
  if (Object.keys(profiles.multiples[id]).length >= TOP_LANGUAGE_GRAMS_MAXLANG) {
    delete profiles.multiples[id]
    continue
  }
  // normalize (and square position)
  const gram = profiles.multiples[id]
  const max = Math.max(...Object.values(gram))
  for (const country of Object.keys(profiles.multiples[id])) {
    const val = profiles.multiples[id][country] / max
    profiles.multiples[id][country] = approximate(val * val)
    // remove match under 1% (save spage)
    if (profiles.multiples[id][country] <= 0.01) delete profiles.multiples[id][country]
  }
}

console.log(`[TinyLD] Training - Serialize`)
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

fs.writeFileSync(DB_PROFILE_PATH, JSON.stringify(profiles, sortKeys, 2))
console.log(`[TinyLD] Done ${configSet} => ${DB_PROFILE_PATH}`)
