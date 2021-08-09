export interface ILangProfiles {
  uniques: { [id: string]: string }
  multiples: { [gram: string]: { [country: string]: number } }
}

// Map ISO 639-2 -> ISO 639-1
const langMap: { [id: string]: string } = {
  // asia
  jpn: 'ja', // japanese
  cmn: 'zh', // chinese
  kor: 'ko', // korean,
  tha: 'th', // thai
  vie: 'vi', // vietnamese
  ind: 'id', // indonesian
  hin: 'hi', // hindi
  khm: 'km', // khmer
  tgl: 'tl', // tagalog (Philippines)
  ben: 'bn', // bengali
  tam: 'ta', // tamil
  mar: 'mr', // marathi
  jav: 'jv', // javanese

  // other
  epo: 'eo', // esperanto
  vol: 'vo', // volapuk

  // europe
  fra: 'fr', // french
  eng: 'en', // english
  deu: 'de', // german
  spa: 'es', // spanish
  por: 'pt', // portuguese
  ita: 'it', // italian
  nld: 'nl', // dutch
  dan: 'da', // danish
  gle: 'ga', // irish
  lat: 'la', // latin

  ces: 'cs', // czech
  srp: 'sr', // serbian
  ell: 'el', // greek
  slk: 'sk', // slovak
  slv: 'sl', // slovenian

  swe: 'sv', // swedish
  fin: 'fi', // finnish
  nob: 'no', // norwegian
  isl: 'is', // icelandic

  hun: 'hu', // hungarian
  ron: 'ro', // romanian
  bul: 'bg', // bulgarian
  bel: 'be', // belarussian
  rus: 'ru', // russian
  ukr: 'uk', // ukrainian
  pol: 'pl', // polish
  lit: 'lt', // lituanian
  est: 'et', // estonian
  lvs: 'lv', // latvian

  // midle east
  tur: 'tr', // turkish
  heb: 'he', // hebrew
  ara: 'ar', // arabic
  pes: 'fa', // persian
  tat: 'tt', // tatar
  tel: 'te' // telugu
}

export const langs = new Set(Object.keys(langMap))

export function ngramTokenizer(text: string, length: number, padding = true): string[] {
  const ngramsArray = []
  const array = padding ? ' '.repeat(length - 1) + text + ' '.repeat(length - 1) : text

  for (let i = 0; i < array.length - (length - 1); i++) {
    const subNgramsArray = []

    for (let j = 0; j < length; j++) {
      subNgramsArray.push(array[i + j])
    }

    ngramsArray.push(subNgramsArray.join(''))
  }

  return ngramsArray
}

export function cleanString(value: string): string {
  return value
    .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/]/gi, '')
    .replace(/[0-9]/g, '')
    .trim()
    .toLowerCase()
}

export function toISOLocale(value: string): string {
  if (value in langMap) return langMap[value]
  return value
}

export function detectUniqueGrams(text: string, profiles: ILangProfiles): string {
  for (const rank of [1, 2, 3, 4, 5]) {
    const grams = ngramTokenizer(text, rank)
    for (const gram of grams) {
      if (gram in profiles.uniques) return toISOLocale(profiles.uniques[gram])
    }
  }
  return ''
}

export function detectPotentialGrams(text: string, profiles: ILangProfiles): string {
  const langScores = new Map<string, number>()

  const grams = ngramTokenizer(text, 3)
  const langSet = new Set([...langs.keys()])

  langSet.forEach((x) => langScores.set(x, 0))
  for (const gram of grams) {
    const gramStat = profiles.multiples[gram]
    if (!gramStat) continue

    const gramLangs = new Set(Object.keys(gramStat))
    for (const lang of langs) {
      if (gramLangs.has(lang)) {
        langScores.set(lang, (langScores.get(lang) || 0) + gramStat[lang])
      } else {
        langScores.set(lang, (langScores.get(lang) || 0) + 400)
      }
    }
  }

  const entries = [...langScores.entries()]
  entries.sort((a, b) => a[1] - b[1])
  if (entries.length > 0) return toISOLocale(entries[0][0])
  return ''
}
