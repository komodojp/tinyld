const { test } = require('uvu')
const assert = require('uvu/assert')
const { supportedLanguages, validateISO2, toISO3, toISO2 } = require('../dist/tinyld.normal.node.js')

test('Supported Language', () => {
  assert.is(supportedLanguages.length, 62)
})

test('Validate Locale', () => {
  assert.is(validateISO2('jp'), 'ja')
  assert.is(validateISO2('ja'), 'ja')
  assert.is(validateISO2('fr'), 'fr')
  assert.is(validateISO2('us'), 'en')
  assert.is(validateISO2('gb'), 'en')
  assert.is(validateISO2('en'), 'en')
})

test('Locale toISO3', () => {
  assert.is(toISO3('jp'), 'jpn')
  assert.is(toISO3('ja'), 'jpn')
  assert.is(toISO3('fr'), 'fra')
})

test('Locale toISO2', () => {
  assert.is(toISO2('jpn'), 'ja')
  assert.is(toISO2('fra'), 'fr')
})

test.run()
