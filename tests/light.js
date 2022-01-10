const { test } = require('uvu')
const assert = require('uvu/assert')
const light = require('../dist/tinyld.light.cjs')

function assertLocale(locale, val) {
  const res = light.detectAll(val)
  if (res.length > 0 && res[0].lang != locale) light.detectAll(val, { verbose: true })
  assert.is(light.detect(val), locale, `is ${locale} : ${val}`)
}

test('Supported Language', () => {
  assert.is(light.supportedLanguages.length, 24)
})

test('Detect English', () => {
  assertLocale('en', 'I’m still learning English, so please speak slowly.')
})

test.run()
