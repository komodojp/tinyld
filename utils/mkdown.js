const fs = require('fs')
const { langRegion, langName, supportedLanguages, toISO2 } = require('../dist/tinyld.cjs')

function getJSON(filepath) {
  return JSON.parse(fs.readFileSync(filepath))
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

async function generateDocLangs() {
  let content = ''
  const regions = [...new Set(supportedLanguages.map((x) => langRegion(x)))]
  regions.sort()
  for (const reg of regions) {
    const langs = supportedLanguages.filter((x) => langRegion(x) === reg)

    content += `\n## ${capitalizeFirstLetter(reg)} (${langs.length})\n`
    langs.sort((a, b) => langName(a).localeCompare(langName(b)))
    langs.forEach((x) => {
      content += `- **${langName(x)}** (ISO Codes: \`${toISO2(x)}\` \`${x}\`)\n`
    })
  }

  fs.writeFileSync(
    './docs/langs.md',
    `# ${supportedLanguages.length} Supported Languages
This list is auto-generated from the code and up-to-date.
${content}`
  )
}

async function generateDocBenchmark() {
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

  const stats = (lib) => {
    return `${data[lib].stats.success_rate}% | ${data[lib].stats.error_rate}% | ${data[lib].stats.unindentified_rate}% | ${data[lib].stats.execution_time}ms.`
  }
  fs.writeFileSync(
    './docs/benchmark.md',
    `# Benchmark Language Detection Libraries
    > Benchmark done on tatoeba dataset (~9M sentences) on 16 of the most common languages.

### **Remark**
- Language evaluated in this benchmark:
    - Asia: \`jpn\`, \`cmn\`, \`kor\`, \`hin\`
    - Europe: \`fra\`, \`spa\`, \`por\`, \`ita\`, \`nld\`, \`eng\`, \`deu\`, \`fin\`, \`rus\`
    - Middle east: , \`tur\`, \`heb\`, \`ara\`
- This kind of benchmark is not perfect and % can vary over time, but it gives a good idea of overall performances

## Overall
| Library        | Script                      | Properly Identified | Improperly identified | Not identified | Avg Execution Time | Disk Size |
| -------------- | --------------------------- | ------------------- | --------------------- | -------------- | ------------------ | --------- |
| **TinyLD**     | \`yarn bench:tinyld\`       | ${stats('tinyld')} | 930KB     |
| **TinyLD Web** | \`yarn bench:tinyld-light\` | ${stats('tinyld-light')} | **110KB** |
| **langdetect** | \`yarn bench:langdetect\`     | ${stats('langdetect')} |  1.8MB    |
| node-cld       | \`yarn bench:cld\`            | ${stats('cld')} |  > 10MB    |
| node-lingua    | \`yarn bench:lingua\`         | ${stats('lingua')} | ~100MB     |
| franc          | \`yarn bench:franc\`          | ${stats('franc')} |  267KB     |
| franc-min      | \`yarn bench:franc-min\`      | ${stats('franc-min')} |  **119KB** |
| franc-all      | \`yarn bench:franc-all\`      | ${stats('franc-all')} |  509KB     |
| languagedetect | \`yarn bench:languagedetect\` | ${stats('languagedetect')} |  **240KB** |

which gives us the following graph
![Benchmark](./overall.svg)

## Per Language
Let's now compare those libraries per language
![Language](./language.svg)

### **Conclusion**

#### Recommended

- For **NodeJS**: \`TinyLD\`, \`langdetect\` or \`node-cld\` (fast and accurate)
- For **Browser**: \`TinyLD Light\` or \`franc-min\` (small, decent accuracy, franc is less accurate but support more languages)

#### Not recommended

- \`node-lingua\` has a quite good accuracy but is just too big and slow
- \`franc-all\` is the worse in term of accuracy, not a surprise because it tries to detect 400+ languages with only 3-grams. A technical demo to put big numbers but useless for real usage, even a language like english barely reach ~45% detection rate.
- \`languagedetect\` is light but just not accurate enough, really focused on indo-european languages (support kazakh but not chinese, korean or japanese). Interesting fact, it's more accurate than franc on west european languages.
`
  )
}

;(async () => {
  await generateDocLangs()
  await generateDocBenchmark()
})()
