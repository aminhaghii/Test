const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'database.db');
const db = new Database(dbPath);

const products = db.prepare('SELECT name, dimension, surface FROM products WHERE dimension = ?').all('100x100');

console.log('100x100 products:');
products.forEach(p => {
  console.log(`- ${p.name} (${p.dimension}, ${p.surface})`);
});

db.close();

