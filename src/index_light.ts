import { isString } from './clean'
import { DetectOption, ILangProfiles, parseDetectOption } from './core'
import data from './profiles/light.json'
import { detectAllStats } from './tokenizer'

const profiles = data as ILangProfiles
const uniqueKeys = new Set(Object.keys(data.uniques))

export function detect(text: string, opts?: Partial<DetectOption>): string {
  const res = detectAll(text, opts)
  return res.length > 0 ? res[0].lang : ''
}

export function detectAll(text: string, opts?: Partial<DetectOption>): { lang: string; accuracy: number }[] {
  const options = parseDetectOption(opts)
  if (!isString(text)) return []

  return detectAllStats(text, options, profiles, uniqueKeys)
}

export { cleanString } from './clean'
export { toISO2, toISO3, langName, langRegion, validateISO2, supportedLanguages } from './core'
