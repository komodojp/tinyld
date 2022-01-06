const fs = require('fs')
const graphOverall = require('./overall')
const graphLanguage = require('./language')

function getJSON(filepath) {
  return JSON.parse(fs.readFileSync(filepath))
}

;(async () => {
  const data = {
    tinyld: getJSON('./data/bench/tinyld.json'),
    'tinyld-light': getJSON('./data/bench/tinyld-light.json'),
    langdetect: getJSON('./data/bench/langdetect.json'),
    cld: getJSON('./data/bench/cld.json'),
    lingua: getJSON('./data/bench/lingua.json'),
    franc: getJSON('./data/bench/franc.json'),
    'franc-min': getJSON('./data/bench/franc-min.json'),
    'franc-all': getJSON('./data/bench/franc-all.json'),
    languagedetect: getJSON('./data/bench/languagedetect.json')
  }

  const overall = await graphOverall(data)
  fs.writeFileSync('./docs/overall.svg', overall.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" '))

  const lang = await graphLanguage(data, ['jpn', 'ara', 'eng', 'fra', 'spa', 'fin', 'rus', 'cmn', 'kor'])
  fs.writeFileSync('./docs/language.svg', lang.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" '))
})()
