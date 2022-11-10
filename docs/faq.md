# Frequently Asked Question

* [Language Detection Error](#my-text-is-detected-in-the-wrong-language)
* [Cand I have a custom version](#can-i-have-a-version-specific-for-my-app-and-my-needs)
* [Short text detection issues](#can-tinyld-identify-short-strings)
* [Live Chat usage](#can-i-use-tinyld-for-an-application-like-a-chat-even-if-texts-are-short)

---

## My text is detected in the wrong language

It's sad to hear, but it's not unusual.

As we can see [here](https://github.com/komodojp/tinyld/blob/develop/docs/benchmark.md#libraries), **Tinyld** is good but not perfect. Overall 1~2% of the time it will get it wrong.

The two things which usually increase error rate:
* short inputs, try to make it longer
* similar language (like spanish and catalan)
* generic names/brand which may appears in multiple language corpus

---

## Can I have a version specific for my app and my needs

Everything in life is about tradeoff.

Tinyld was designed to be accurate, small and fast.
Based on how much space and resource you are ready to spend, we provide different flavor

- **Tinyld** : The general one (~500KB) which detect 64 languages
- **Tinyld Light** : Mostly for browser usage (~70KB) which detect 24 languages
- **Tinyld Heavy** : The one for backend usage (few MB) which focus on accuracy only

To select the one you want, simply change your import
```ts
import { detect } from 'tinyld'
import { detect } from 'tinyld/light'
import { detect } from 'tinyld/heavy'
```

---

## Can tinyld identify short strings?

If by short you mean one or two word with a good accuracy, the answer is most likely **No**.

The key point here is to understand the algorithms behind language detection.
* How can you detect a text language, from many possibilities without embedding a dictionary of each language?
* Even just between 2 or 3 languages, how would you do it? Handcraft regexp for specific languages?
* How can you scale up this method easily to more languages?

There are multiple approaches to solve this problem, but the two main ones are AI and statistics.
And the general idea is to recognize some patterns or succession of letters that are specific to each language. ([n-gram](https://en.wikipedia.org/wiki/N-gram))

**Good part**:
* we don't need to understand a language syntax to detect it
* can be extended to more language fairly easily
* the signature of a language can be quite small only few KB

**Bad part**:
* it require a certain size of text to get a good detection level and valuable n-grams
* mixed language content is hard to detect

We are always looking for way to improve our process, and you can find some benchmark [related to this](https://github.com/komodojp/tinyld/blob/develop/docs/benchmark.md#accuracy-by-text-length).
But to give some numbers:
* Tinyld usually pass the ~95% detection accuracy threshold around ~24 characters
* It fall at ~80% for 12 characters (barely usable)
* Less than 10 characters it's just random

---

## Can I use tinyld for an application like a chat, even if texts are short?

Yes you can, and this is why it was built originally.

One of the easy ways to workaround the size issue is to keep a context, a user is unlikely to change language abruptly in the middle of a discussion. And multiple users usually chat in a common language.
So you can keep some buffer (like the last 256 characters of this user in this channel) and check this and not just the last message.

This gives stability and more accurate results to the detection.

