const REGEXP_PUNCTUATIONS = /[,.。，、#%&/\\+*!¿?[\]！？;:…„“«»”"“_–—~]/gi
const REGEXP_NUMBERS = /[0-9]/g
const REGEXP_FULLWIDTH_NUMBERS = /[\uFF10-\uFF19]/g
const REGEXP_SPACES = /\s\s+/g
const REGEXP_APOSTROPHE = /’/gi
const REGEXP_NORMALIZE = /[\u0300-\u036f]/g

export function isString(value: unknown): boolean {
  return typeof value === 'string' || value instanceof String
}

export function cleanString(value: string): string {
  return value
    .toLowerCase()
    .replace(REGEXP_APOSTROPHE, "'")
    .replace(REGEXP_PUNCTUATIONS, ' ')
    .replace(REGEXP_FULLWIDTH_NUMBERS, (m) => String.fromCharCode(m.charCodeAt(0) - 0xfee0))
    .replace(REGEXP_NUMBERS, '')
    .replace(REGEXP_SPACES, ' ')
    .trim()
}

export function normalize(value: string): string {
  return value.normalize('NFD').replace(REGEXP_NORMALIZE, '')
}
