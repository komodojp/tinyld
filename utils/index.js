const fs = require('fs')
const graphOverall = require('./overall')
const graphLanguage = require('./language')
const graphLength = require('./length')
const graphExecution = require('./exectime')

function getJSON(filepath) {
  return JSON.parse(fs.readFileSync(filepath))
}

;(async () => {
  const data = {
    'tinyld-heavy': getJSON('./data/bench/tinyld-heavy.json'),
    tinyld: getJSON('./data/bench/tinyld.json'),
    'tinyld-light': getJSON('./data/bench/tinyld-light.json'),
    langdetect: getJSON('./data/bench/langdetect.json'),
    cld: getJSON('./data/bench/cld.json'),
    franc: getJSON('./data/bench/franc.json'),
    'franc-min': getJSON('./data/bench/franc-min.json'),
    'franc-all': getJSON('./data/bench/franc-all.json'),
    languagedetect: getJSON('./data/bench/languagedetect.json')
  }

  const overall = await graphOverall(data)
  fs.writeFileSync('./docs/overall.svg', overall.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" '))

  const lang = await graphLanguage(data, ['jpn', 'kor', 'cmn', 'ara', 'fin', 'rus', 'fra', 'spa', 'por', 'eng'])
  fs.writeFileSync('./docs/language.svg', lang.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" '))

  const len = await graphLength(data)
  fs.writeFileSync('./docs/length.svg', len.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" '))

  const exe = await graphExecution(data)
  fs.writeFileSync('./docs/exec_time.svg', exe.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" '))
})()
