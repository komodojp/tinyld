import { cleanString, detectPotentialGrams, detectUniqueGrams, ILangProfiles } from './core'
import data from './profiles.json'

const profiles = data as ILangProfiles

export function detect(text: string): string {
  const txt = cleanString(text)
  let res = detectUniqueGrams(txt, profiles)
  if (res === '') res = detectPotentialGrams(txt, profiles)
  return res
}
