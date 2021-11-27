export interface ILangProfiles {
  uniques: { [id: string]: string }
  multiples: { [gram: string]: { [country: string]: number } }
  words: { [gram: string]: { [country: string]: number } }
}

// different config profiles
const config = {
  light: {
    TRAINING_UNIQUE_GRAMS: [1, 2, 3],
    TOP_LANGUAGE_UNIQUE_GRAMS: 60,
    TOP_WORD: 75,
    TOP_WORD_MAXLANG: 10,
    TOP_GRAM: 35,
    TOP_GRAM_MAXLANG: 10
  },
  normal: {
    TRAINING_UNIQUE_GRAMS: [1, 2, 3],
    TOP_LANGUAGE_UNIQUE_GRAMS: 400,
    TOP_WORD: 1000000,
    TOP_WORD_MAXLANG: 30,
    TOP_GRAM: 1000000,
    TOP_GRAM_MAXLANG: 30
  }
}

// configuration
export const configSet = (process.env.TINYLD_CONFIG || 'normal') as 'normal' | 'light'
export const TRAINING_UNIQUE_GRAMS = config[configSet].TRAINING_UNIQUE_GRAMS
export const TOP_WORD = config[configSet].TOP_WORD
export const TOP_WORD_MAXLANG = config[configSet].TOP_WORD_MAXLANG
export const TOP_GRAM = config[configSet].TOP_GRAM
export const TOP_GRAM_MAXLANG = config[configSet].TOP_GRAM_MAXLANG
export const TOP_LANGUAGE_UNIQUE_GRAMS = config[configSet].TOP_LANGUAGE_UNIQUE_GRAMS

const PROBABILITY_ACCURACY = 10000

export function approximate(value: number): number {
  return Math.round(value * PROBABILITY_ACCURACY) / PROBABILITY_ACCURACY
}

export function isSkipProba(country: string): boolean {
  return !!langMap[country].skipProb
}

type LangOption = { code: string; alias?: string[]; skipLight?: boolean; skipProb?: boolean }

export const parseDetectOption = (options?: Partial<DetectOption>): DetectOption => {
  const data = { only: [], verbose: false }
  if (!options) return data
  return Object.assign(data, options)
}

export interface DetectOption {
  only: string[]
  verbose: boolean
}

// Map ISO 639-3 <-> ISO 639-1
const langMap: { [id: string]: LangOption } = {
  // asia
  jpn: { code: 'ja', alias: ['jp'], skipProb: true }, // japanese
  cmn: { code: 'zh', alias: ['cn'], skipProb: true }, // chinese
  kor: { code: 'ko', alias: ['kr'], skipProb: true }, // korean,
  tha: { code: 'th', skipProb: true }, // thai
  vie: { code: 'vi', skipProb: true }, // vietnamese
  ind: { code: 'id', skipLight: true }, // indonesian
  khm: { code: 'km', skipLight: true, skipProb: true }, // khmer
  tgl: { code: 'tl', skipLight: true }, // tagalog (Philippines)
  jav: { code: 'jv' }, // javanese

  // other
  epo: { code: 'eo', skipLight: true }, // esperanto
  vol: { code: 'vo', skipLight: true }, // volapuk

  // europe
  fra: { code: 'fr' }, // french
  eng: { code: 'en', alias: ['us', 'gb'] }, // english
  deu: { code: 'de' }, // german
  spa: { code: 'es' }, // spanish
  por: { code: 'pt', alias: ['po'] }, // portuguese
  ita: { code: 'it' }, // italian
  nld: { code: 'nl' }, // dutch
  dan: { code: 'da', skipLight: true }, // danish
  gle: { code: 'ga', skipLight: true }, // irish
  lat: { code: 'la', skipLight: true }, // latin

  ces: { code: 'cs' }, // czech
  hrv: { code: 'hr', skipLight: true }, // croatian
  srp: { code: 'sr', skipLight: true }, // serbian
  ell: { code: 'el', alias: ['gr'], skipProb: true }, // greek
  mkd: { code: 'mk', skipLight: true }, // macedonian
  slk: { code: 'sk', skipLight: true }, // slovak
  slv: { code: 'sl', skipLight: true }, // slovenian

  swe: { code: 'sv' }, // swedish
  fin: { code: 'fi' }, // finnish
  nob: { code: 'no' }, // norwegian
  isl: { code: 'is', skipLight: true }, // icelandic

  hun: { code: 'hu' }, // hungarian
  ron: { code: 'ro' }, // romanian
  bul: { code: 'bg' }, // bulgarian
  bel: { code: 'be', skipLight: true }, // belarusian
  rus: { code: 'ru' }, // russian
  ukr: { code: 'uk' }, // ukrainian
  pol: { code: 'pl' }, // polish
  lit: { code: 'lt', skipLight: true }, // lithuanian
  est: { code: 'et', skipLight: true }, // estonian
  lvs: { code: 'lv', skipLight: true }, // latvian

  // india
  ben: { code: 'bn', skipProb: true }, // bengali
  tam: { code: 'ta', skipLight: true, skipProb: true }, // tamil
  mar: { code: 'mr', skipLight: true, skipProb: true }, // marathi
  hin: { code: 'hi' }, // hindi
  urd: { code: 'ur', skipLight: true, skipProb: true }, // urdu
  guj: { code: 'gu', skipLight: true, skipProb: true }, // gujarati
  kan: { code: 'kn', skipLight: true, skipProb: true }, // kannada
  tel: { code: 'te', skipLight: true, skipProb: true }, // telugu

  // africa
  amh: { code: 'am', skipLight: true, skipProb: true }, // amharic
  hau: { code: 'ha', skipLight: true }, // hausa
  ber: { code: 'ber', skipLight: true }, // berber (no iso2)
  swh: { code: 'sw', skipLight: true }, // swahili

  // midle east
  tur: { code: 'tr' }, // turkish
  heb: { code: 'he' }, // hebrew
  ara: { code: 'ar', skipProb: true }, // arabic
  pes: { code: 'fa', skipProb: true }, // persian
  tat: { code: 'tt', skipLight: true, skipProb: true }, // tatar
  kab: { code: 'kb', skipLight: true }, // kabyle
  tuk: { code: 'tk', skipLight: true }, // turkmen
  uzb: { code: 'uz', skipLight: true } // uzbek
}

export const langs = new Set(
  Object.entries(langMap)
    .filter((x) => configSet === 'normal' || (configSet === 'light' && !x[1].skipLight))
    .map((x) => x[0])
)

export function validateISO2(iso2: string): string {
  const found = Object.entries(langMap).find((x) => x[1].code === iso2)
  if (found) return found[1].code
  const foundAlias = Object.entries(langMap).find((x) => x[1].alias && x[1].alias.includes(iso2))
  return foundAlias ? foundAlias[1].code : ''
}

export function toISO2(iso3: string): string {
  if (iso3 in langMap) return langMap[iso3].code
  return iso3
}

export function toISO3(iso2: string): string {
  const found = Object.entries(langMap).find((x) => x[1].code === iso2)
  if (found) return found[0]
  const foundAlias = Object.entries(langMap).find((x) => x[1].alias && x[1].alias.includes(iso2))
  if (foundAlias) return foundAlias[0]
  return ''
}
