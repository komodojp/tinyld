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

| Library          | Script                      | Language | Properly Identified | Improperly identified | Not identified | Avg Execution Time | Disk Size |
| ---------------- | --------------------------- | -------- | ------------------- | --------------------- | -------------- | ------------------ | --------- |
| **TinyLD Heavy** | `yarn bench:tinyld-heavy`   | 64       | 99.2597%            | 0.739%                | 0.0013%        | 0.06ms.            | 2.0MB     |
| **TinyLD**       | `yarn bench:tinyld`         | 64       | 98.5677%            | 1.3336%               | 0.0987%        | 0.0725ms.          | 580KB     |
| **TinyLD Light** | `yarn bench:tinyld-light`   | 24       | 97.9242%            | 1.9456%               | 0.1303%        | 0.0617ms.          | 68KB      |
| \*\*langdetect   | `yarn bench:langdetect`     | 53       | 95.7148%            | 4.2852%               | 0%             | 0.2981ms.          | 1.8MB     |
| node-cld         | `yarn bench:cld`            | 160      | 92.3628%            | 1.6212%               | 6.016%         | 0.0567ms.          | > 10MB    |
| franc            | `yarn bench:franc`          | 187      | 74.2478%            | 25.7522%              | 0%             | 0.1547ms.          | 267KB     |
| franc-min        | `yarn bench:franc-min`      | 82       | 70.3772%            | 23.1986%              | 6.4242%        | 0.0689ms.          | 119KB     |
| franc-all        | `yarn bench:franc-all`      | 403      | 66.6957%            | 33.3043%              | 0%             | 0.3561ms.          | 509KB     |
| languagedetect   | `yarn bench:languagedetect` | 52       | 65.306%             | 11.2826%              | 23.4114%       | 0.1813ms.          | 240KB     |

---

## Global Accuracy

![Benchmark](./overall.svg)

We see two group of libraries

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

## Execution Time

![Size](./exec_time.svg)

Here we can notice few things about performance:

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

- `franc-all` is the worst in terms of accuracy, not a surprise because it tries to detect 400+ languages with only 3-grams. A technical demo to put big numbers but useless for real usage, even a language like english barely reaches ~45% detection rate.
- `languagedetect` is light but just not accurate enough

---

## Last word :raising_hand:

Thanks for reading this article, those metrics are really helpful for the development of `tinyld`.
It's used in the development to see the impact of every modification and features.

If you want to contribute or see another library in this benchmark, [open an issue](https://github.com/komodojp/tinyld/issues)
