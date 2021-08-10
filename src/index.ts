import { cleanString, isString, normalize } from './clean'
import { ILangProfiles } from './core'
import data from './profiles/normal.json'
import { detectAllPotentialGrams, detectPotentialGrams, detectUniqueGrams } from './tokenizer'

const profiles = data as ILangProfiles

export function detect(text: string): string {
  if (!isString(text)) return ''

  const txt = cleanString(text) // clean input
  if (!txt) return ''

  const res = detectUniqueGrams(txt, profiles) // pass 1 : unique grams
  if (res !== '') return res

  return detectPotentialGrams(normalize(txt), profiles) // pass 2 : use probabilities
}

export function detectAll(text: string, verbose = false): { lang: string; accuracy: number }[] {
  if (!isString(text)) return []

  const txt = cleanString(text) // clean input
  if (!txt) return []

  const res = detectUniqueGrams(txt, profiles) // pass 1 : unique grams
  if (res !== '') return [{ lang: res, accuracy: 1 }]

  return detectAllPotentialGrams(normalize(txt), profiles, verbose) // pass 2 : use probabilities
}

export { cleanString } from './clean'
export { toISO2, toISO3, validateISO2 } from './core'
