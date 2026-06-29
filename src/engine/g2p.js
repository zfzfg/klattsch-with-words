import { cmudict } from './cmudict.js';

// Letter names in ARPABET
const LETTER_NAMES = {
  a: 'EY',
  b: 'B IY',
  c: 'S IY',
  d: 'D IY',
  e: 'IY',
  f: 'EH F',
  g: 'JH IY',
  h: 'EY CH',
  i: 'AY',
  j: 'JH EY',
  k: 'K EY',
  l: 'EH L',
  m: 'EH M',
  n: 'EH N',
  o: 'OW',
  p: 'P IY',
  q: 'K Y UW',
  r: 'AA R',
  s: 'EH S',
  t: 'T IY',
  u: 'Y UW',
  v: 'V IY',
  w: 'D AH B AH L Y UW',
  x: 'EH K S',
  y: 'W AY',
  z: 'Z IY',
};

/**
 * Converts English text to a string of ARPABET phonemes.
 * Uses CMUdict for lookup, and falls back to spelling out letters for unknown words.
 *
 * @param {string} text - The input English text.
 * @returns {string} - The translated ARPABET phoneme string.
 */
export function textToPhonemes(text) {
  // Normalize punctuation and split into words
  // Keep apostrophes for words like "don't"
  const normalized = text.toLowerCase().replace(/[^a-z0-9'\s]/g, ' ');
  const words = normalized.split(/\s+/).filter(w => w.length > 0);

  const phonemes = [];

  for (let word of words) {
    // Remove trailing/leading apostrophes if any
    word = word.replace(/^'+|'+$/g, '');
    
    if (!word) continue;

    if (cmudict[word]) {
      phonemes.push(cmudict[word]);
    } else {
      // Fallback: spell it out or try to handle numbers if they are digits
      if (/^\d+$/.test(word)) {
        // Simple digit spelling fallback
        const digits = {
          '0': 'Z IH R OW', '1': 'W AH N', '2': 'T UW', '3': 'TH R IY',
          '4': 'F AO R', '5': 'F AY V', '6': 'S IH K S', '7': 'S EH V AH N',
          '8': 'EY T', '9': 'N AY N'
        };
        for (const char of word) {
          if (digits[char]) phonemes.push(digits[char]);
        }
      } else {
        // Spell out letters
        for (const char of word) {
          if (LETTER_NAMES[char]) {
            phonemes.push(LETTER_NAMES[char]);
          }
        }
      }
    }
  }

  return phonemes.join(' ');
}
