const Database = require('better-sqlite3');
const path = require('path');

// Initialize database
const dbPath = path.join(__dirname, 'database.db');
const db = new Database(dbPath);

console.log('🎨 Checking products with decor images...\n');

// Get total count
const totalCount = db.prepare('SELECT COUNT(*) as count FROM products').get();
console.log(`📦 Total products: ${totalCount.count}`);

// Get products with decor images
const decorCount = db.prepare('SELECT COUNT(*) as count FROM products WHERE decor_image_url IS NOT NULL').get();
console.log(`🖼️  Products with decor images: ${decorCount.count}`);
console.log(`📈 Coverage: ${((decorCount.count / totalCount.count) * 100).toFixed(2)}%\n`);

// Show samples from each dimension
const dimensions = ['30x30', '30x90', '40x40', '40x100', '60x60', '60x120', '80x80', '100x100'];

console.log('📋 Sample products with decor images:\n');

dimensions.forEach(dim => {
  const samples = db.prepare(`
    SELECT name, dimension, surface, color, decor_image_url 
    FROM products 
    WHERE dimension = ? AND decor_image_url IS NOT NULL 
    LIMIT 3
  `).all(dim);
  
  if (samples.length > 0) {
    console.log(`\n📁 ${dim}:`);
    samples.forEach(product => {
      console.log(`   ✅ ${product.name} (${product.surface}, ${product.color})`);
      console.log(`      🖼️  ${product.decor_image_url}`);
    });
  }
});

console.log('\n✨ Check completed!');

