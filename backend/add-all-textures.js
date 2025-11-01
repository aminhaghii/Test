const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database.db');
const db = new Database(dbPath);

const ALMAS_DIR = path.join(__dirname, '..', 'ALMAS');

function getAllTextureImages() {
  const texturesByDimension = {};
  
  const dimensionFolders = [
    '30x30/Matt',
    '30x90/Trans', 
    '40x40/Matt',
    '40x100',
    '60x60/Matt',
    '60x60/Trans',
    '60x120/60x120 Matt',
    '60x120/60x120 Polished',
    '60x120/60x120Trans',
    '80x80/Polished',
    '100 100/Polished'
  ];
  
  for (const folderPath of dimensionFolders) {
    const fullPath = path.join(ALMAS_DIR, folderPath);
    if (!fs.existsSync(fullPath)) continue;
    
    const dimension = folderPath.split('/')[0].replace('100 100', '100x100');
    const files = fs.readdirSync(fullPath);
    const imageFiles = files.filter(f => /\.(jpg|jpeg)$/i.test(f));
    
    if (!texturesByDimension[dimension]) {
      texturesByDimension[dimension] = [];
    }
    
    for (const imageFile of imageFiles) {
      const imageUrl = `/ALMAS/${folderPath}/${imageFile}`;
      texturesByDimension[dimension].push(imageUrl);
    }
  }
  
  return texturesByDimension;
}

console.log('🖼️  Adding texture images to all products...\n');

const texturesByDimension = getAllTextureImages();

// Show what we found
for (const [dimension, images] of Object.entries(texturesByDimension)) {
  console.log(`${dimension}: ${images.length} images`);
}

console.log('\n');

const products = db.prepare('SELECT id, name, dimension FROM products').all();

let updated = 0;

for (const product of products) {
  const dimensionTextures = texturesByDimension[product.dimension];
  
  if (dimensionTextures && dimensionTextures.length > 0) {
    // Pick up to 20 random images from this dimension
    const shuffled = dimensionTextures.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(20, shuffled.length));
    
    const textureImagesJson = JSON.stringify(selected);
    
    db.prepare('UPDATE products SET texture_images = ? WHERE id = ?').run(textureImagesJson, product.id);
    console.log(`✅ ${product.name} (${product.dimension}): ${selected.length} images`);
    updated++;
  }
}

console.log(`\n============================================================`);
console.log(`📊 SUMMARY`);
console.log(`============================================================`);
console.log(`✅ Total products: ${products.length}`);
console.log(`🖼️  Products updated: ${updated}`);
console.log(`\n✨ Done!`);

db.close();

