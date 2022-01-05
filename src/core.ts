export interface ILangProfiles {
  uniques: { [id: string]: string }
  multiples: { [gram: string]: { [country: string]: number } }
}

// different config profiles
const config = {
  light: {
    TRAINING_UNIQUE_GRAMS: [1, 2, 3, 4],
    TOP_LANGUAGE_UNIQUE_GRAMS: 60,
    TOP_LANGUAGE_STATS_GRAMS: 50
  },
  normal: {
    TRAINING_UNIQUE_GRAMS: [1, 2, 3, 4, 5],
    TOP_LANGUAGE_UNIQUE_GRAMS: 100,
    TOP_LANGUAGE_STATS_GRAMS: 180
  }
}

// configuration
export const configSet = (process.env.TINYLD_CONFIG || 'normal') as 'normal' | 'light'
export const TRAINING_UNIQUE_GRAMS = config[configSet].TRAINING_UNIQUE_GRAMS
export const TOP_LANGUAGE_UNIQUE_GRAMS = config[configSet].TOP_LANGUAGE_UNIQUE_GRAMS
export const TOP_LANGUAGE_STATS_GRAMS = config[configSet].TOP_LANGUAGE_STATS_GRAMS

const PROBABILITY_ACCURACY = 10000

export function approximate(value: number): number {
  return Math.round(value * PROBABILITY_ACCURACY) / PROBABILITY_ACCURACY
}

export function isSkipProba(country: string): boolean {
  return langMap[country].coefProb === 0
}

export function getCoef(country: string): number {
  return langMap[country].coefProb ?? 1
}

export function getLangTopStatsGram(country: string): number {
  return Math.round((langMap[country].coefProb ?? 1) * TOP_LANGUAGE_STATS_GRAMS)
}

type LangOption = {
  code: string
  region: string
  name: string
  alias?: string[]
  skipLight?: boolean
  coefProb?: number
}

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
  // africa
  afr: { code: 'af', region: 'africa', name: 'Afrikaans', skipLight: true },
  amh: { code: 'am', region: 'africa', name: 'Amharic', skipLight: true, coefProb: 0 },
  // hau: { code: 'ha', region: 'africa', name: 'Hausa', skipLight: true },
  ber: { code: 'ber', region: 'africa', name: 'Berber', skipLight: true, coefProb: 0.25 },
  run: { code: 'rn', region: 'africa', name: 'Kirundi', skipLight: true },
  // swh: { code: 'sw', region: 'africa', name: 'Swahili', skipLight: true },
  // yor: { code: 'yo', region: 'africa', name: 'Yoruba', skipLight: true },

  // asia
  jpn: { code: 'ja', region: 'asia-east', name: 'Japanese', alias: ['jp'], coefProb: 0 },
  cmn: { code: 'zh', region: 'asia-east', name: 'Chinese', alias: ['cn'], coefProb: 0.25 },
  kor: { code: 'ko', region: 'asia-east', name: 'Korean', alias: ['kr'], coefProb: 0 },
  mya: { code: 'my', region: 'asia', name: 'Burmese', skipLight: true, coefProb: 0 },
  tha: { code: 'th', region: 'asia', name: 'Thai', coefProb: 0 },
  vie: { code: 'vi', region: 'asia', name: 'Vietnamese', skipLight: true, coefProb: 0 },
  ind: { code: 'id', region: 'asia', name: 'Indonesian', skipLight: true },
  khm: { code: 'km', region: 'asia', name: 'Khmer', skipLight: true, coefProb: 0 },
  // zsm: { code: 'ms', region: 'asia', name: 'Malaysian', skipLight: true },
  tgl: { code: 'tl', region: 'asia', name: 'Tagalog', skipLight: true },
  // jav: { code: 'jv', region: 'asia', name: 'Javanese', skipLight: true },
  ben: { code: 'bn', region: 'asia-south', name: 'Bengali', coefProb: 0 },
  tam: { code: 'ta', region: 'asia-south', name: 'Tamil', skipLight: true, coefProb: 0 },
  // mar: { code: 'mr', region: 'asia-south', name: 'Marathi', skipLight: true, coefProb: 0 },
  hin: { code: 'hi', region: 'asia-south', name: 'Hindi', coefProb: 0 },
  urd: { code: 'ur', region: 'asia-south', name: 'Urdu', skipLight: true, coefProb: 0 },
  guj: { code: 'gu', region: 'asia-south', name: 'Gujarati', skipLight: true, coefProb: 0 },
  kan: { code: 'kn', region: 'asia-south', name: 'Kannada', skipLight: true, coefProb: 0 },
  tel: { code: 'te', region: 'asia-south', name: 'Telugu', skipLight: true, coefProb: 0 },

  // europe
  fra: { code: 'fr', region: 'europe-west', name: 'French' },
  eng: { code: 'en', region: 'europe-west', name: 'English', alias: ['us', 'gb'] },
  deu: { code: 'de', region: 'europe-west', name: 'German', coefProb: 0.5 },
  spa: { code: 'es', region: 'europe-west', name: 'Spanish' },
  cat: { code: 'ca', region: 'europe-west', name: 'Catalan', skipLight: true },
  por: { code: 'pt', region: 'europe-west', name: 'Portuguese', alias: ['po'] },
  ita: { code: 'it', region: 'europe-west', name: 'Italian' },
  nld: { code: 'nl', region: 'europe-west', name: 'Dutch' },
  gle: { code: 'ga', region: 'europe-west', name: 'Irish', skipLight: true },
  lat: { code: 'la', region: 'europe', name: 'Latin', skipLight: true },
  ces: { code: 'cs', region: 'europe', name: 'Czech', skipLight: true },
  // hrv: { code: 'hr', region: 'europe', name: 'Croatian', skipLight: true },
  srp: { code: 'sr', region: 'europe', name: 'Serbian', skipLight: true },
  ell: { code: 'el', region: 'europe', name: 'Greek', alias: ['gr'], coefProb: 0 },
  mkd: { code: 'mk', region: 'europe', name: 'Macedonian', skipLight: true, coefProb: 1.5 },
  slk: { code: 'sk', region: 'europe', name: 'Slovak', skipLight: true },
  // slv: { code: 'sl', region: 'europe', name: 'Slovenian', skipLight: true },
  dan: { code: 'da', region: 'europe-north', name: 'Danish', skipLight: true, coefProb: 1.5 },
  swe: { code: 'sv', region: 'europe-north', name: 'Swedish' },
  fin: { code: 'fi', region: 'europe-north', name: 'Finnish' },
  nob: { code: 'no', region: 'europe-north', name: 'Norwegian', coefProb: 1.5 },
  isl: { code: 'is', region: 'europe-north', name: 'Icelandic', skipLight: true, coefProb: 0.5 },
  hun: { code: 'hu', region: 'europe-east', name: 'Hungarian' },
  ron: { code: 'ro', region: 'europe-east', name: 'Romanian', coefProb: 0.5 },
  bul: { code: 'bg', region: 'europe-east', name: 'Bulgarian', skipLight: true },
  bel: { code: 'be', region: 'europe-east', name: 'Belarusian', skipLight: true },
  rus: { code: 'ru', region: 'europe-east', name: 'Russian' },
  ukr: { code: 'uk', region: 'europe-east', name: 'Ukrainian', skipLight: true },
  pol: { code: 'pl', region: 'europe-east', name: 'Polish', coefProb: 0.5 },
  lit: { code: 'lt', region: 'europe-east', name: 'Lithuanian', skipLight: true },
  est: { code: 'et', region: 'europe-east', name: 'Estonian', skipLight: true },
  lvs: { code: 'lv', region: 'europe-east', name: 'Latvian', skipLight: true },

  // middle east
  hye: { code: 'hy', region: 'middle-east', name: 'Armenian', skipLight: true, coefProb: 0 },
  tur: { code: 'tr', region: 'middle-east', name: 'Turkish' },
  heb: { code: 'he', region: 'middle-east', name: 'Hebrew', coefProb: 0 },
  yid: { code: 'yi', region: 'middle-east', name: 'Yiddish', skipLight: true, coefProb: 0.5 },
  ara: { code: 'ar', region: 'middle-east', name: 'Arabic', coefProb: 0 },
  pes: { code: 'fa', region: 'middle-east', name: 'Persian', skipLight: true, coefProb: 0 },
  tat: { code: 'tt', region: 'middle-east', name: 'Tatar', skipLight: true, coefProb: 0 },
  // kab: { code: 'kb', region: 'middle-east', name: 'Kabyle', skipLight: true },
  kaz: { code: 'kk', region: 'middle-east', name: 'Kazakh', skipLight: true },
  mon: { code: 'mn', region: 'middle-east', name: 'Mongolian', skipLight: true },
  tuk: { code: 'tk', region: 'middle-east', name: 'Turkmen', skipLight: true },
  // uzb: { code: 'uz', region: 'middle-east', name: 'Uzbek', skipLight: true }

  // other
  epo: { code: 'eo', region: 'other', name: 'Esperanto', skipLight: true, coefProb: 0.5 },
  vol: { code: 'vo', region: 'other', name: 'Volapuk', skipLight: true, coefProb: 0.5 },
  toki: { code: 'toki', region: 'other', name: 'Toki Pona', skipLight: true, coefProb: 0.1 },
  tlh: { code: 'tlh', region: 'other', name: 'Klingon', skipLight: true, coefProb: 0.25 }
}

export const langs = new Set(
  Object.entries(langMap)
    .filter((x) => configSet === 'normal' || (configSet === 'light' && !x[1].skipLight))
    .map((x) => x[0])
)
export const supportedLanguages = [...langs.values()]

export function langRegion(iso3: string): string {
  if (iso3 in langMap) return langMap[iso3].region
  return ''
}

export function langName(iso3: string): string {
  if (iso3 in langMap) return langMap[iso3].name
  return ''
}

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
