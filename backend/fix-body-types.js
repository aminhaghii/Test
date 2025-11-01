const Database = require('better-sqlite3');
const path = require('path');

// Initialize database
const dbPath = path.join(__dirname, 'database.db');
const db = new Database(dbPath);

console.log('🔧 Fixing body types based on surface...\n');

// Fix all products
const polishedUpdated = db.prepare(`
  UPDATE products 
  SET body_type = 'Porcelain' 
  WHERE surface = 'Polished'
`).run();

console.log(`✅ Polished products: ${polishedUpdated.changes} updated to Porcelain`);

const nonPolishedUpdated = db.prepare(`
  UPDATE products 
  SET body_type = 'White Body' 
  WHERE surface != 'Polished' AND surface IS NOT NULL
`).run();

console.log(`✅ Non-Polished products: ${nonPolishedUpdated.changes} updated to White Body`);

console.log(`\n✨ Total: ${polishedUpdated.changes + nonPolishedUpdated.changes} products updated`);

db.close();

