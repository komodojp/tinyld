import { cleanString, isString, normalize } from './clean'
import { DetectOption, ILangProfiles, parseDetectOption } from './core'
import data from './profiles/normal.json'
import { detectAllPotentialGrams, detectPotentialGrams, detectUniqueGrams } from './tokenizer'

const profiles = data as ILangProfiles
const uniqueKeys = new Set(Object.keys(data.uniques))

export function detect(text: string, opts?: Partial<DetectOption>): string {
  const options = parseDetectOption(opts)
  if (!isString(text)) return ''

  const txt = cleanString(text) // clean input
  if (!txt) return ''

  const res = detectUniqueGrams(txt, profiles, uniqueKeys, options) // pass 1 : unique grams
  if (res !== '') return res

  return detectPotentialGrams(normalize(txt), profiles, options) // pass 2 : use probabilities
}

export function detectAll(text: string, opts?: Partial<DetectOption>): { lang: string; accuracy: number }[] {
  const options = parseDetectOption(opts)
  if (!isString(text)) return []

  const txt = cleanString(text) // clean input
  if (!txt) return []

  const res = detectUniqueGrams(txt, profiles, uniqueKeys, options) // pass 1 : unique grams
  if (res !== '') return [{ lang: res, accuracy: 1 }]

  return detectAllPotentialGrams(normalize(txt), profiles, options) // pass 2 : use probabilities
}

export { cleanString } from './clean'
export { toISO2, toISO3, validateISO2 } from './core'
