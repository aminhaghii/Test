const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'database.db');
const db = new Database(dbPath);

function updateImageUrls() {
  console.log('🔄 Updating image_url from decor_image_url...\n');

  const updateStmt = db.prepare(`
    UPDATE products
    SET image_url = decor_image_url,
        updated_at = CURRENT_TIMESTAMP
    WHERE decor_image_url IS NOT NULL 
      AND (image_url IS NULL OR image_url = '')
  `);
  
  const result = updateStmt.run();
  
  console.log(`✅ Updated ${result.changes} products with decor images`);
  
  // Show summary
  const totalWithImages = db.prepare(`
    SELECT COUNT(*) as count 
    FROM products 
    WHERE image_url IS NOT NULL AND image_url != ''
  `).get();
  
  console.log(`\n📊 Total products with images: ${totalWithImages.count}`);
  
  db.close();
}

updateImageUrls();
