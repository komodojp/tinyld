# **TinyLD** (Light Flavor, for web usage)

The normal library can be a bit massive (mostly caused by the language profile database), which can be problematic for web usage.

For this usage we also provide a lighter version (a tradeoff between disk size and accuracy)

- import with: `import { detect } from 'tinyld/dist/tinyld.light.cjs'`
- normal version ~900KB, light version is only ~100KB (~25KB with gzip)
- only 24 languages supported
- slightly less accurate, only ~90%
