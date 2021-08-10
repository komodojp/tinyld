const { test } = require('uvu')
const assert = require('uvu/assert')
const { cleanString } = require('../dist/tinyld.cjs')

function check(str, expected) {
  assert.is(cleanString(str), expected, `Clean ${str}`)
}

test('Clean String - Punctuation', () => {
  check('Bonjour', 'bonjour')
  check('Bonjour,', 'bonjour')
  check('Bonjour, comment ca va?', 'bonjour comment ca va')
  check('先程、どういうわけかマイクが入りませんでした。', '先程 どういうわけかマイクが入りませんでした')
  check('¿Dónde vives?', 'dónde vives')

  check('那是一张近照吗？', '那是一张近照吗')
  check('那就表示有問題...', '那就表示有問題')
  check('要变得完美，她就是少了一个缺点。', '要变得完美 她就是少了一个缺点')
  check(
    '"Daran habe ich nie gedacht", sagte der alte Mann. "Was sollen wir tun?"',
    'daran habe ich nie gedacht sagte der alte mann was sollen wir tun'
  )
  check(
    '„Wann wirst du zurückkommen?“ – „Das hängt ganz vom Wetter ab.“',
    'wann wirst du zurückkommen das hängt ganz vom wetter ab'
  )
})

test.run()
