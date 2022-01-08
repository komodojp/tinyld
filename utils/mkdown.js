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
    `# NodeJS Language Detection Benchmark :rocket:
- This kind of benchmark is not perfect and % can vary over time, but it gives a good idea of overall performances
- Language evaluated in this benchmark:
    - Asia: \`jpn\`, \`cmn\`, \`kor\`, \`hin\`
    - Europe: \`fra\`, \`spa\`, \`por\`, \`ita\`, \`nld\`, \`eng\`, \`deu\`, \`fin\`, \`rus\`
    - Middle east: , \`tur\`, \`heb\`, \`ara\`
- This page and graphs are auto-generated from the code

---

## Libraries

Here is the list of libraries in this benchmark

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

---

## Global Accuracy
![Benchmark](./overall.svg)

We see two group of libraries (separated by \`node-lingua\` in the middle)
- \`tinyld\`, \`langdetect\` and \`cld\` over 90% accuracy
- \`franc\` and \`languagedetect\` under 75% accuracy

## Per Language
![Language](./language.svg)

We see big differences between languages:
* **Japanese** or **Korean** are almost at 100% for every libs (lot of unique characters)
* **Spanish** and **Portuguese** are really close and cause more false-positive and an higher error-rate

## Accuracy By Text length
Most libraries are using statistical analysis, so longer is the input text, better will be the detection.
So we can often see quotes like this in those library documentations.
> Make sure to pass it big documents to get reliable results.

Let's see if this statement is true, and how those libraries behave for different input size (from small to long)
![Size](./length.svg)

So the previous quote is right, over 512 characters all the libs become accurate enough.

But for a ~95% accuracy threshold:
* \`tinyld\` (green) reaches it around 24 characters
* \`langdetect\` (cyan) and \`cld\` (orange) reach it around 48 characters
* \`lingua\` (red) and \`franc\` (pink) need more than 256 characters to reach it

## Execution Time
![Size](./exec_time.svg)

Here we can notice few things about performance:
* \`node-lingua\` (red) collapse at a scary rate
* \`langdetect\` (cyan) and \`franc\` (pink) seems to slow down at a similar rate
* \`tinyld\` (green) slow down but at a really flat rate
* \`cld\` (orange) is definitely the fastest and doesn't show any apparent slow down

But we've seen previously that some of those libraries need more than 256 characters to be accurate.
It means they start to slow down at the same time they start to give decent results.

---

## **Conclusion**

### Recommended :thumbsup:

#### - By platform :computer:

- For **NodeJS**: \`TinyLD\`, \`langdetect\` or \`node-cld\` (fast and accurate)
- For **Browser**: \`TinyLD Light\` or \`franc-min\` (small, decent accuracy, franc is less accurate but support more languages)

#### - By usage :speech_balloon:

- Short text (chatbot, keywords, database, ...): \`TinyLD\` or \`langdetect\`
- Long text (documents, webpage): \`node-cld\` or \`TinyLD\`

### Not recommended :thumbsdown: 

- \`node-lingua\` has decent accuracy but is just too big and slow
- \`franc-all\` is the worst in terms of accuracy, not a surprise because it tries to detect 400+ languages with only 3-grams. A technical demo to put big numbers but useless for real usage, even a language like english barely reaches ~45% detection rate.
- \`languagedetect\` is light but just not accurate enough

---

## Last word :raising_hand:

Thanks for reading this article, those metrics are really helpful for the development of \`tinyld\`.
It's used in the development to see the impact of every modification and features.

If you want to contribute or see another library in this benchmark, [open an issue](https://github.com/komodojp/tinyld/issues)`
  )
}

;(async () => {
  await generateDocLangs()
  await generateDocBenchmark()
})()
