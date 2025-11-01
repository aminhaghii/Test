const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database.db');
const db = new Database(dbPath);

const ALMAS_DIR = path.join(__dirname, '..', 'ALMAS');
const DECORED_DIR = path.join(__dirname, '..', 'DECORED');

function getDecorImageName(product) {
  // Products from DECORED have decor_image_url
  const url = product.decor_image_url || '';
  if (url.includes('/DECORED/')) {
    const parts = url.split('/');
    return parts[parts.length - 1].replace(/\.(jpg|jpeg)$/i, '');
  }
  return null;
}

function findMatchingTextureImages(decorImageName, productDimension) {
  const matchingTextures = [];
  
  // Map dimensions to ALMAS folders
  const folderMap = {
    '30x30': ['30x30/Matt', '30x30/Trans'],
    '30x90': ['30x90/Trans', '30x90/Matt'],
    '40x40': ['40x40/Matt', '40x40/Polished'],
    '40x100': ['40x100', '40x100/Matt'],
    '60x60': ['60x60/Matt', '60x60/Trans', '60x60/Polished'],
    '60x120': ['60x120/60x120 Matt', '60x120/60x120 Polished', '60x120/60x120Trans'],
    '80x80': ['80x80/Polished', '80x80/Matt'],
    '100x100': ['100 100/Polished', '100 100/Matt']
  };
  
  const folders = folderMap[productDimension] || [];
  
  for (const folder of folders) {
    const folderPath = path.join(ALMAS_DIR, folder);
    if (!fs.existsSync(folderPath)) continue;
    
    const files = fs.readdirSync(folderPath);
    const imageFiles = files.filter(f => /\.(jpg|jpeg)$/i.test(f));
    
    for (const imageFile of imageFiles) {
      const imageName = imageFile.replace(/\.(jpg|jpeg)$/i, '');
      
      // Try to match
      if (imageName.toUpperCase().includes(decorImageName.toUpperCase()) ||
          decorImageName.toUpperCase().includes(imageName.split(' ')[0].toUpperCase())) {
        const imageUrl = `/ALMAS/${folder}/${imageFile}`;
        matchingTextures.push(imageUrl);
      }
    }
  }
  
  return matchingTextures;
}

console.log('🔍 Matching texture images to products based on DECORED images...\n');

const products = db.prepare('SELECT id, name, dimension, decor_image_url FROM products WHERE decor_image_url IS NOT NULL').all();

let matched = 0;

for (const product of products) {
  const decorImageName = getDecorImageName(product);
  
  if (!decorImageName) continue;
  
  const textureImages = findMatchingTextureImages(decorImageName, product.dimension);
  
  if (textureImages.length > 0) {
    matched++;
    const textureImagesJson = JSON.stringify(textureImages.slice(0, 20)); // Limit to 20
        
    db.prepare('UPDATE products SET texture_images = ? WHERE id = ?').run(textureImagesJson, product.id);
    console.log(`✅ ${product.name} (${product.dimension}): ${textureImages.length} matches from "${decorImageName}"`);
  }
}

console.log(`\n============================================================`);
console.log(`📊 SUMMARY`);
console.log(`============================================================`);
console.log(`🎯 Products with decor_image_url: ${products.length}`);
console.log(`🖼️  Products matched with texture images: ${matched}`);
console.log(`\n✨ Done!`);

db.close();

