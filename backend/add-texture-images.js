const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'database.db');
const db = new Database(dbPath);

const ALMAS_DIR = path.join(__dirname, '..', 'ALMAS');

function extractProductName(filename) {
  let name = filename.replace(/\.(jpg|jpeg|png)$/i, '');
  // Remove numbers at the end
  name = name.replace(/\s*[F]\d+$/, ''); // Remove F1, F2, etc
  name = name.replace(/\s*\d+$/, ''); // Remove any remaining numbers
  name = name.toUpperCase().trim();
  return name;
}

function getAllTextureImages() {
  const textureImages = [];
  
  // Helper function to process a directory
  function processDirectory(dir, dimension) {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    const imageFiles = files.filter(f => /\.(jpg|jpeg)$/i.test(f));
    
    for (const imageFile of imageFiles) {
      const productName = extractProductName(imageFile);
      const imageUrl = `/ALMAS/${dimension}/${imageFile}`;
      
      textureImages.push({
        productName,
        imageUrl,
        dimension
      });
    }
  }
  
  // Process each dimension folder
  const dimensionFolders = ['30x30/Matt', '30x90/Trans', '40x40/Matt', '40x100/Trans', '60x60/Matt', '60x60/Trans', '60x120/60x120 Matt', '60x120/60x120 Polished', '60x120/60x120Trans', '80x80/Polished', '100 100/Polished'];
  
  for (const folderPath of dimensionFolders) {
    const fullPath = path.join(ALMAS_DIR, folderPath);
    const dimension = folderPath.split('/')[0].replace('100 100', '100x100').replace(/\//g, '');
    processDirectory(fullPath, folderPath);
  }
  
  return textureImages;
}

console.log('🖼️  Adding texture images to products...\n');

const textureImages = getAllTextureImages();
console.log(`Found ${textureImages.length} texture images\n`);

// Get all products
const products = db.prepare('SELECT id, name, dimension, surface FROM products').all();

let updated = 0;
let matched = 0;

for (const product of products) {
  // Find matching texture images
  const matchingImages = textureImages.filter(img => {
    const imgName = extractProductName(img.imageUrl.split('/').pop()).toUpperCase();
    const prodName = extractProductName(product.name).toUpperCase();
    
    // Try exact match first
    if (imgName === prodName) return true;
    
    // Try without dimension
    if (img.dimension.includes(product.dimension)) return true;
    
    return false;
  });
  
  if (matchingImages.length > 0) {
    matched++;
    const imageUrls = matchingImages.map(img => img.imageUrl);
    const textureImagesJson = JSON.stringify(imageUrls);
    
    try {
      db.prepare('UPDATE products SET texture_images = ? WHERE id = ?').run(textureImagesJson, product.id);
      console.log(`✅ ${product.name} (${product.dimension}, ${product.surface}): ${matchingImages.length} images`);
      updated++;
    } catch (error) {
      console.error(`❌ Error updating ${product.name}:`, error.message);
    }
  } else {
    // Try to match by dimension and similar name
    const similarImages = textureImages.filter(img => {
      const pathParts = img.imageUrl.split('/');
      const folderName = pathParts[pathParts.length - 2];
      return folderName.includes(product.dimension);
    });
    
    if (similarImages.length > 0) {
      // Get first few similar images
      const imageUrls = similarImages.slice(0, 3).map(img => img.imageUrl);
      const textureImagesJson = JSON.stringify(imageUrls);
      
      db.prepare('UPDATE products SET texture_images = ? WHERE id = ?').run(textureImagesJson, product.id);
      console.log(`⚠️  ${product.name} (partial match): ${similarImages.length} images`);
      updated++;
    }
  }
}

console.log(`\n============================================================`);
console.log(`📊 SUMMARY`);
console.log(`============================================================`);
console.log(`✅ Total products: ${products.length}`);
console.log(`🖼️  Products updated with texture images: ${updated}`);
console.log(`🎯 Exact matches: ${matched}`);
console.log(`\n✨ Done!`);

db.close();

