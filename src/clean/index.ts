export function isString(value: unknown): boolean {
  return typeof value === 'string' || value instanceof String
}

function stripPunctuation(val: string): string {
  return val.replace(/[,.。，、!¿?！？;:…/„“«»”"“_–—~\\/]/gi, ' ')
}

function stripNumbers(val: string): string {
  return val.replace(/[0-9]/g, '')
}

function replaceFullwidthNumbers(val: string): string {
  return val.replace(/[\uFF10-\uFF19]/g, function (m) {
    return String.fromCharCode(m.charCodeAt(0) - 0xfee0)
  })
}

export function cleanString(value: string): string {
  const data = value.replace(/’/gi, "'")
  return stripPunctuation(stripNumbers(replaceFullwidthNumbers(data.toLowerCase())))
    .replace(/\s\s+/g, ' ')
    .trim()
}

export function normalize(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}
