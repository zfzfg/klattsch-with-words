import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CMUDICT_URL = 'https://raw.githubusercontent.com/cmusphinx/cmudict/master/cmudict.dict';
const OUT_PATH = path.join(__dirname, '../src/engine/cmudict.js');

console.log('Downloading CMUdict...');

https.get(CMUDICT_URL, (res) => {
  if (res.statusCode !== 200) {
    console.error(`Failed to download: ${res.statusCode}`);
    process.exit(1);
  }

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Parsing CMUdict...');
    const lines = data.split('\n');
    const dict = {};

    for (const line of lines) {
      // Ignore comments and empty lines
      if (!line || line.startsWith(';;;')) continue;

      const parts = line.split(' ');
      let word = parts[0];
      
      // Handle alternative pronunciations like WORD(1), WORD(2)
      if (word.endsWith(')')) {
        word = word.replace(/\(\d+\)$/, '');
      }

      // Convert word to lowercase
      word = word.toLowerCase();

      // Only take the first pronunciation for simplicity
      if (!dict[word]) {
        // Remove stress numbers from phonemes since klattsch handles stress differently
        // e.g. AH0 -> AH
        const phonemes = parts.slice(1).filter(p => p).map(p => p.replace(/[0-9]/g, '')).join(' ');
        dict[word] = phonemes;
      }
    }

    fs.writeFileSync(OUT_PATH, `export const cmudict = ${JSON.stringify(dict)};\n`);
    console.log(`Saved ${Object.keys(dict).length} words to ${OUT_PATH}`);
  });
}).on('error', (err) => {
  console.error('Error downloading:', err.message);
  process.exit(1);
});
