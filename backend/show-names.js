const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database.db');
const db = new Database(dbPath);

const ALMAS_DIR = path.join(__dirname, '..', 'ALMAS');

console.log('📝 Showing some product names and texture image names...\n');

// Show some product names
const products = db.prepare('SELECT name, dimension FROM products LIMIT 10').all();
console.log('Product names (first 10):');
products.forEach(p => {
  console.log(`  - "${p.name}" (${p.dimension})`);
});

console.log('\n');

// Show some texture image names
const texturePath = path.join(ALMAS_DIR, '100 100', 'Polished');
const files = fs.readdirSync(texturePath).filter(f => /\.(jpg|jpeg)$/i.test(f)).slice(0, 10);
console.log('Texture image names (first 10):');
files.forEach(f => {
  console.log(`  - "${f.replace(/\.(jpg|jpeg)$/i, '')}"`);
});

db.close();

