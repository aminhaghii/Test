const Database = require('better-sqlite3');
const path = require('path');

// Initialize database
const dbPath = path.join(__dirname, 'database.db');
const db = new Database(dbPath);

// Specifications based on dimensions
const specifications = {
  '30x30': { thickness: 8.5, absorption_rate: '3-6' },
  '40x40': { thickness: 13.5, absorption_rate: '6-10' },
  '60x60': { thickness: 10.5, absorption_rate: '3-6' },
  '40x120': { thickness: 11, absorption_rate: '3-6' },
  '60x120': { thickness: 10, absorption_rate: '6-10' },
  '30x60': { thickness: 8.5, absorption_rate: '11-18' },
  '30x90': { thickness: 9.5, absorption_rate: '11-18' }
};

console.log('📝 Adding specifications to products...\n');

let updated = 0;

for (const [dimension, specs] of Object.entries(specifications)) {
  const result = db.prepare(`
    UPDATE products 
    SET thickness = ?, absorption_rate = ? 
    WHERE dimension = ?
  `).run(specs.thickness, specs.absorption_rate, dimension);
  
  updated += result.changes;
  console.log(`✅ ${dimension}: ${result.changes} products updated (Thickness: ${specs.thickness}mm, Absorption: ${specs.absorption_rate}%)`);
}

console.log(`\n✨ Total: ${updated} products updated with specifications`);

db.close();

