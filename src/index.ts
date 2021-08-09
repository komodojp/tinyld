import { detectPotentialGrams, detectUniqueGrams, ILangProfiles } from './core'
import data from './profiles.json'

const profiles = data as ILangProfiles

export function detect(text: string): string {
  let res = detectUniqueGrams(text, profiles)
  if (res === '') res = detectPotentialGrams(text, profiles)
  return res
}
