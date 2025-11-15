const fs = require('fs');
const path = require('path');

// Read all translation files
const en = JSON.parse(fs.readFileSync('src/translations/en.json', 'utf8'));
const fa = JSON.parse(fs.readFileSync('src/translations/fa.json', 'utf8'));
const ar = JSON.parse(fs.readFileSync('src/translations/ar.json', 'utf8'));
const es = JSON.parse(fs.readFileSync('src/translations/es.json', 'utf8'));
const it = JSON.parse(fs.readFileSync('src/translations/it.json', 'utf8'));

// Function to deep merge objects
function deepMerge(target, source) {
  for (const key in source) {
    if (key in target && typeof target[key] === 'object' && typeof source[key] === 'object' && !Array.isArray(target[key]) && !Array.isArray(source[key])) {
      deepMerge(target[key], source[key]);
    } else if (!(key in target)) {
      target[key] = source[key];
    }
  }
  return target;
}

// Function to add missing keys from English to target
function addMissingKeys(base, target) {
  const result = JSON.parse(JSON.stringify(target)); // Deep clone
  return deepMerge(result, base);
}

// Complete translations
const faComplete = addMissingKeys(en, fa);
const arComplete = addMissingKeys(en, ar);
const esComplete = addMissingKeys(en, es);
const itComplete = addMissingKeys(en, it);

// Write back to files
fs.writeFileSync('src/translations/fa.json', JSON.stringify(faComplete, null, 2), 'utf8');
fs.writeFileSync('src/translations/ar.json', JSON.stringify(arComplete, null, 2), 'utf8');
fs.writeFileSync('src/translations/es.json', JSON.stringify(esComplete, null, 2), 'utf8');
fs.writeFileSync('src/translations/it.json', JSON.stringify(itComplete, null, 2), 'utf8');

console.log('Translations completed!');

