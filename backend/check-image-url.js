const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'database.db');
const db = new Database(dbPath);

function checkImageUrls() {
  console.log('📊 Checking product image URLs...\n');

  const productsWithoutImages = db.prepare(`
    SELECT COUNT(*) as count 
    FROM products 
    WHERE image_url IS NULL OR image_url = ''
  `).get();
  
  console.log(`❌ Products without image_url: ${productsWithoutImages.count}`);

  const productsWithImages = db.prepare(`
    SELECT COUNT(*) as count 
    FROM products 
    WHERE image_url IS NOT NULL AND image_url != ''
  `).get();
  
  console.log(`✅ Products with image_url: ${productsWithImages.count}`);

  const sampleProducts = db.prepare(`
    SELECT id, name, dimension, image_url, decor_image_url
    FROM products 
    LIMIT 5
  `).all();

  console.log('\n📋 Sample products:');
  sampleProducts.forEach(p => {
    console.log(`  - ${p.name} (${p.dimension})`);
    console.log(`    image_url: ${p.image_url || 'NULL'}`);
    console.log(`    decor_image_url: ${p.decor_image_url || 'NULL'}`);
  });

  db.close();
}

checkImageUrls();
