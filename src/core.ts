export interface ILangProfiles {
  uniques: { [id: string]: string }
  multiples: { [gram: string]: { [country: string]: number } }
}

// different config profiles
const config = {
  light: {
    DATASET_MAX_LINE_PER_LANGUAGE: 8000,
    TRAINING_UNIQUE_GRAMS: [1, 2, 3],
    TOP_LANGUAGE_UNIQUE_GRAMS: 80,
    TOP_LANGUAGE_GRAMS: 70,
    TOP_LANGUAGE_GRAMS_MAXLANG: 6,
    DB_PROFILE: 'src/profiles/light.json'
  },
  normal: {
    DATASET_MAX_LINE_PER_LANGUAGE: 40000,
    TRAINING_UNIQUE_GRAMS: [1, 2, 3, 4, 5],
    TOP_LANGUAGE_UNIQUE_GRAMS: 200,
    TOP_LANGUAGE_GRAMS: 800,
    TOP_LANGUAGE_GRAMS_MAXLANG: 10,
    DB_PROFILE: 'src/profiles/normal.json'
  }
}

// configuration
export const configSet = (process.env.TINYLD_CONFIG || 'normal') as 'normal' | 'light'
export const DATASET_MAX_LINE_PER_LANGUAGE = config[configSet].DATASET_MAX_LINE_PER_LANGUAGE
export const TRAINING_UNIQUE_GRAMS = config[configSet].TRAINING_UNIQUE_GRAMS
export const TOP_LANGUAGE_UNIQUE_GRAMS = config[configSet].TOP_LANGUAGE_UNIQUE_GRAMS
export const TOP_LANGUAGE_GRAMS = config[configSet].TOP_LANGUAGE_GRAMS
export const TOP_LANGUAGE_GRAMS_MAXLANG = config[configSet].TOP_LANGUAGE_GRAMS_MAXLANG
export const DB_PROFILE_PATH = config[configSet].DB_PROFILE

const PROBABILITY_ACCURACY = 10000

export function approximate(value: number): number {
  return Math.round(value * PROBABILITY_ACCURACY) / PROBABILITY_ACCURACY
}

export function isSkipProba(country: string): boolean {
  return !!langMap[country].skipProb
}

export function isExtraSample(country: string): boolean {
  return !!langMap[country].extraSample
}

type LangOption = { code: string; alias?: string[]; skipLight?: boolean; skipProb?: boolean; extraSample?: boolean }

// Map ISO 639-3 <-> ISO 639-1
const langMap: { [id: string]: LangOption } = {
  // asia
  jpn: { code: 'ja', alias: ['jp'], skipProb: true }, // japanese
  cmn: { code: 'zh', alias: ['cn'], skipProb: true }, // chinese
  kor: { code: 'ko', alias: ['kr'], skipProb: true }, // korean,
  tha: { code: 'th', skipProb: true }, // thai
  vie: { code: 'vi', skipProb: true }, // vietnamese
  ind: { code: 'id', skipLight: true }, // indonesian
  hin: { code: 'hi' }, // hindi
  khm: { code: 'km', skipProb: true, skipLight: true }, // khmer
  tgl: { code: 'tl', skipLight: true }, // tagalog (Philippines)
  ben: { code: 'bn', skipProb: true, skipLight: true }, // bengali
  tam: { code: 'ta', skipLight: true }, // tamil
  mar: { code: 'mr', skipLight: true }, // marathi
  jav: { code: 'jv' }, // javanese

  // other
  epo: { code: 'eo', skipLight: true }, // esperanto
  vol: { code: 'vo', skipLight: true }, // volapuk

  // europe
  fra: { code: 'fr', extraSample: true }, // french
  eng: { code: 'en', alias: ['us', 'gb'], extraSample: true }, // english
  deu: { code: 'de' }, // german
  spa: { code: 'es', extraSample: true }, // spanish
  por: { code: 'pt', alias: ['po'] }, // portuguese
  ita: { code: 'it', extraSample: true }, // italian
  nld: { code: 'nl', extraSample: true, skipLight: true }, // dutch
  dan: { code: 'da', skipLight: true }, // danish
  gle: { code: 'ga', skipLight: true }, // irish
  lat: { code: 'la', skipLight: true }, // latin

  ces: { code: 'cs', skipLight: true }, // czech
  srp: { code: 'sr', skipLight: true }, // serbian
  ell: { code: 'el', alias: ['gr'] }, // greek
  slk: { code: 'sk', skipLight: true }, // slovak
  slv: { code: 'sl', skipLight: true }, // slovenian

  swe: { code: 'sv', extraSample: true }, // swedish
  fin: { code: 'fi', extraSample: true }, // finnish
  nob: { code: 'no', extraSample: true }, // norwegian
  isl: { code: 'is', skipLight: true }, // icelandic

  hun: { code: 'hu' }, // hungarian
  ron: { code: 'ro' }, // romanian
  bul: { code: 'bg' }, // bulgarian
  bel: { code: 'be', extraSample: true, skipLight: true }, // belarussian
  rus: { code: 'ru', extraSample: true }, // russian
  ukr: { code: 'uk', extraSample: true }, // ukrainian
  pol: { code: 'pl' }, // polish
  lit: { code: 'lt' }, // lituanian
  est: { code: 'et' }, // estonian
  lvs: { code: 'lv' }, // latvian

  // midle east
  tur: { code: 'tr', skipProb: true }, // turkish
  heb: { code: 'he', skipProb: true }, // hebrew
  ara: { code: 'ar', skipProb: true }, // arabic
  pes: { code: 'fa', skipProb: true }, // persian
  tat: { code: 'tt', skipProb: true, skipLight: true }, // tatar
  tel: { code: 'te', skipLight: true } // telugu
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
