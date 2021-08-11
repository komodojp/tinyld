const { test } = require('uvu')
const assert = require('uvu/assert')
const { detect, detectAll } = require('../dist/tinyld.cjs')

function assertLocale(locale, val) {
  const res = detectAll(val)
  if (res[0].lang != locale) detectAll(val, { verbose: true })
  assert.is(detect(val), locale, `is ${locale} : ${val}`)
}

test('Check input', () => {
  assert.is(detect(''), '')
  assert.is(detect(1), '')
})

test('Detect French', () => {
  assertLocale('fr', 'Bonjour')
  assertLocale('fr', 'Bonne après-midi')
  assertLocale('fr', 'Ceci est un texte en francais.')
  // assertLocale('fr', 'reste cool sac a merde')
})

test('Detect Japanese', () => {
  assertLocale('ja', 'モリーンです。')
  assertLocale('ja', '本は面白いです')
  assertLocale('ja', 'これは日本語です.')
})

test('Detect Korean', () => {
  assertLocale('ko', '저는 7년 동안 한국에서 살았어요')
  assertLocale('ko', '한국인')
})

test('Detect English', () => {
  assertLocale('en', 'I’m still learning English, so please speak slowly.')
  assertLocale('en', 'I just started working here')
  assertLocale('en', 'Good morning')
  assertLocale('en', 'and this is english.')
})

test.run()
