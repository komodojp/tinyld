# NodeJS Language Detection Benchmark :rocket:

- This kind of benchmark is not perfect and % can vary over time, but it gives a good idea of overall performances
- Language evaluated in this benchmark:
  - Asia: `jpn`, `cmn`, `kor`, `hin`
  - Europe: `fra`, `spa`, `por`, `ita`, `nld`, `eng`, `deu`, `fin`, `rus`
  - Middle east: , `tur`, `heb`, `ara`
- This page and graphs are auto-generated from the code

---

## Libraries

Here is the list of libraries in this benchmark

| Library        | Script                      | Properly Identified | Improperly identified | Not identified | Avg Execution Time | Disk Size |
| -------------- | --------------------------- | ------------------- | --------------------- | -------------- | ------------------ | --------- |
| **TinyLD**     | `yarn bench:tinyld`         | 98.274%             | 1.6277%               | 0.0983%        | 0.1002ms.          | 930KB     |
| **TinyLD Web** | `yarn bench:tinyld-light`   | 97.8901%            | 1.9765%               | 0.1334%        | 0.0868ms.          | **110KB** |
| **langdetect** | `yarn bench:langdetect`     | 95.6623%            | 4.3377%               | 0%             | 0.584ms.           | 1.8MB     |
| node-cld       | `yarn bench:cld`            | 92.2917%            | 1.6375%               | 6.0708%        | 0.0687ms.          | > 10MB    |
| node-lingua    | `yarn bench:lingua`         | 87.1399%            | 0.069%                | 12.7912%       | 1.1357ms.          | ~100MB    |
| franc          | `yarn bench:franc`          | 74.0083%            | 25.9917%              | 0%             | 0.1947ms.          | 267KB     |
| franc-min      | `yarn bench:franc-min`      | 70.1002%            | 23.4164%              | 6.4834%        | 0.0914ms.          | **119KB** |
| franc-all      | `yarn bench:franc-all`      | 66.3846%            | 33.6154%              | 0%             | 0.576ms.           | 509KB     |
| languagedetect | `yarn bench:languagedetect` | 65.9069%            | 11.3828%              | 22.7103%       | 0.2643ms.          | **240KB** |

---

## Global Accuracy

![Benchmark](./overall.svg)

We see two group of libraries (separated by `node-lingua` in the middle)

- `tinyld`, `langdetect` and `cld` over 90% accuracy
- `franc` and `languagedetect` under 75% accuracy

## Per Language

![Language](./language.svg)

We see big differences between languages:

- **Japanese** or **Korean** are almost at 100% for every libs (lot of unique characters)
- **Spanish** and **Portuguese** are really close and cause more false-positive and an higher error-rate

## Accuracy By Text length

Most libraries are using statistical analysis, so longer is the input text, better will be the detection.
So we can often see quotes like this in those library documentations.

> Make sure to pass it big documents to get reliable results.

Let's see if this statement is true, and how those libraries behave for different input size (from small to long)
![Size](./length.svg)

So the previous quote is right, over 512 characters all the libs become accurate enough.

But for a ~95% accuracy threshold:

- `tinyld` (green) reaches it around 24 characters
- `langdetect` (cyan) and `cld` (orange) reach it around 48 characters
- `lingua` (red) and `franc` (pink) need more than 256 characters to reach it

## Execution Time

![Size](./exec_time.svg)

Here we can notice few things about performance:

- `node-lingua` (red) collapse at a scary rate
- `langdetect` (cyan) and `franc` (pink) seems to slow down at a similar rate
- `tinyld` (green) slow down but at a really flat rate
- `cld` (orange) is definitely the fastest and doesn't show any apparent slow down

But we've seen previously that some of those libraries need more than 256 characters to be accurate.
It means they start to slow down at the same time they start to give decent results.

---

## **Conclusion**

### Recommended :thumbsup:

#### - By platform :computer:

- For **NodeJS**: `TinyLD`, `langdetect` or `node-cld` (fast and accurate)
- For **Browser**: `TinyLD Light` or `franc-min` (small, decent accuracy, franc is less accurate but support more languages)

#### - By usage :speech_balloon:

- Short text (chatbot, keywords, database, ...): `TinyLD` or `langdetect`
- Long text (documents, webpage): `node-cld` or `TinyLD`

### Not recommended :thumbsdown:

- `node-lingua` has decent accuracy but is just too big and slow
- `franc-all` is the worst in terms of accuracy, not a surprise because it tries to detect 400+ languages with only 3-grams. A technical demo to put big numbers but useless for real usage, even a language like english barely reaches ~45% detection rate.
- `languagedetect` is light but just not accurate enough

---

## Last word :raising_hand:

Thanks for reading this article, those metrics are really helpful for the development of `tinyld`.
It's used in the development to see the impact of every modification and features.

If you want to contribute or see another library in this benchmark, [open an issue](https://github.com/komodojp/tinyld/issues)
