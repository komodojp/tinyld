import { LanguageDetector } from 'lingua-node'
import { benchmark } from './bench'

const detector = new LanguageDetector()
benchmark((txt) => detector.detectLanguage(txt) || '')
