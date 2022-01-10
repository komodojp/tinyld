import { isString } from './clean'
import { DetectOption, ILangProfiles, parseDetectOption, ILangCompressedProfiles, langFromId } from './core'
import data from './profiles/light.json'
import { detectAllStats } from './tokenizer'

const compressed = data as ILangCompressedProfiles
const profiles: ILangProfiles = {
  uniques: Object.fromEntries(
    Object.entries(compressed.uniques).map((x) => {
      return [x[0], langFromId[parseInt(x[1].toString(), 36)]]
    })
  ),
  multiples: Object.fromEntries(
    Object.entries(compressed.multiples).map((x) => {
      const entry = Object.fromEntries(
        x[1].match(/(.{1,3})/g)?.map((y) => {
          const country = y.slice(0, 1)
          const val = y.slice(1)
          return [langFromId[parseInt(country, 36)], parseInt(val, 36)]
        }) || []
      )
      return [x[0], entry]
    })
  )
}
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
