import fs from 'fs'
import { ILangProfiles, langs, ngramTokenizer } from './core'

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

const file = fs.readFileSync('data/sentences.csv', 'utf-8')
for (const line of file.split('\n')) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_id, country, text] = line.split('\t')
  if (!langs.has(country)) continue
  const lines = langTexts.get(country) || 0
  if (lines > 10000) continue
  langTexts.set(country, lines + 1)

  // clean and tokenize
  const cleanText = text
    .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/]/gi, '')
    .replace(/[0-9]/g, '')
    .trim()
    .toLowerCase()
  for (const gramLength of [1, 2, 3, 4, 5]) {
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

for (const gramId of ['1', '2', '3', '4', '5']) {
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
  const currentCountryGrams = new Set<string>()
  for (const gramLength of [1, 2, 3, 4, 5]) {
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
    uniqueCountryGrams = uniqueCountryGrams.slice(0, 160)
    uniqueCountryGrams.forEach((x) => currentCountryGrams.add(x.text))
    const uniques = uniqueCountryGrams.map((x) => x.text)
    uniques.forEach((x) => {
      profiles.uniques[x] = country
    })
    const countryUniques = new Set(uniques)

    // save non unique 3-grams
    if (gramLength != 3) continue
    const values = [...countryGrams]
    values.filter((x) => !countryUniques.has(x.text))
    values.sort((a, b) => b.usage - a.usage)
    const entries = values.slice(0, 320)
    entries.forEach((gram: NGram, index: number) => {
      if (!profiles.multiples[gram.text]) profiles.multiples[gram.text] = {}
      profiles.multiples[gram.text][country] = index
    })
  }
}

fs.writeFileSync(`src/profiles.json`, JSON.stringify(profiles, null, 2))
