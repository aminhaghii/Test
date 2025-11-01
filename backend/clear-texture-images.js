const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'database.db');
const db = new Database(dbPath);

console.log('🧹 Clearing all texture_images...\n');

const result = db.prepare('UPDATE products SET texture_images = NULL').run();

console.log(`✅ All texture_images cleared (${result.changes} products)`);
console.log('\n✨ Done!');

db.close();

