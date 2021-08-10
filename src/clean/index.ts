export function isString(value: unknown): boolean {
  return typeof value === 'string' || value instanceof String
}

export function cleanString(value: string): string {
  const data = value
    .replace(/’/gi, "'")
    .replace(/[,.。，、!¿?！？;:…/„“«»”"“_–—~\\/]/gi, ' ')
    .replace(/[0-9]/g, '')
    .replace(/\s\s+/g, ' ')
    .trim()
    .toLowerCase()
  return data
}

export function normalize(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}
