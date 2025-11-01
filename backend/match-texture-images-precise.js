const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database.db');
const db = new Database(dbPath);

const ALMAS_DIR = path.join(__dirname, '..', 'ALMAS');

function normalizeName(name) {
  return name
    .replace(/\s*F\d+$/, '') // Remove F1, F2, etc
    .replace(/\s*\(\d+\)$/, '') // Remove (1), (2), etc
    .replace(/\s*MATT\s*\(?\d*\)?\s*$/i, '') // Remove MATT (2)
    .replace(/\s*DARK\s*MATT\s*\(?\d*\)?\s*$/i, '')
    .replace(/\s*\(2\)\s*$/i, '')
    .replace(/\s*GRAY\s*BARAGH\s*$/i, '')
    .replace(/\s*ROZA\s*$/i, '')
    .replace(/\s*CREAM\s*$/i, '')
    .replace(/\s*GLOSSY\s*$/i, '')
    .replace(/\s+DARK\s*$/i, '')
    .replace(/\s+LIGHT\s*$/i, '')
    .toUpperCase()
    .trim();
}

function getTextureImagesForProduct(productName, productDimension, productSurface) {
  const textureImages = [];
  
  // Build dimension folder path
  let dimFolder = productDimension.toLowerCase().replace(' ', '');
  if (dimFolder === '100x100') {
    dimFolder = '100 100/Polished';
  } else {
    // Map dimensions to folders
    const folderMap = {
      '30x30': '30x30/Matt',
      '30x90': '30x90/Trans',
      '40x40': '40x40/Matt',
      '40x100': '40x100/Trans',
      '60x60': '60x60/Matt',
      '60x120': productSurface === 'Matt' ? '60x120/60x120 Matt' : '60x120/60x120 Polished',
      '80x80': '80x80/Polished',
      '80x80': '80x80/Polished'
    };
    dimFolder = folderMap[dimFolder] || dimFolder;
  }
  
  const folderPath = path.join(ALMAS_DIR, dimFolder);
  
  if (!fs.existsSync(folderPath)) {
    return [];
  }
  
  const files = fs.readdirSync(folderPath);
  const imageFiles = files.filter(f => /\.(jpg|jpeg)$/i.test(f));
  
  const normalizedProductName = normalizeName(productName);
  
  for (const imageFile of imageFiles) {
    const normalizedImageName = normalizeName(imageFile.replace(/\.(jpg|jpeg)$/i, ''));
    
    // Check if they match
    if (normalizedImageName === normalizedProductName) {
      const imageUrl = `/ALMAS/${dimFolder}/${imageFile}`;
      textureImages.push(imageUrl);
    }
  }
  
  // If no exact match, try with different surface folders
  if (textureImages.length === 0) {
    // Try other folders for same dimension
    const altFolders = [];
    if (productDimension === '60x60') {
      altFolders.push('60x60/Trans');
    }
    if (productDimension === '60x120') {
      if (productSurface === 'Matt') {
        altFolders.push('60x120/60x120 Polished', '60x120/60x120Trans');
      } else {
        altFolders.push('60x120/60x120 Matt', '60x120/60x120Trans');
      }
    }
    
    for (const altFolder of altFolders) {
      const altPath = path.join(ALMAS_DIR, altFolder);
      if (fs.existsSync(altPath)) {
        const files = fs.readdirSync(altPath);
        const imageFiles = files.filter(f => /\.(jpg|jpeg)$/i.test(f));
        
        for (const imageFile of imageFiles) {
          const normalizedImageName = normalizeName(imageFile.replace(/\.(jpg|jpeg)$/i, ''));
          if (normalizedImageName === normalizedProductName) {
            const imageUrl = `/ALMAS/${altFolder}/${imageFile}`;
            textureImages.push(imageUrl);
          }
        }
      }
    }
  }
  
  return textureImages;
}

console.log('🖼️  Matching texture images precisely...\n');

const products = db.prepare('SELECT id, name, dimension, surface FROM products').all();

let updated = 0;
let matched = 0;

for (const product of products) {
  const textureImages = getTextureImagesForProduct(product.name, product.dimension, product.surface);
  
  if (textureImages.length > 0) {
    matched++;
    const textureImagesJson = JSON.stringify(textureImages);
    
    try {
      db.prepare('UPDATE products SET texture_images = ? WHERE id = ?').run(textureImagesJson, product.id);
      console.log(`✅ ${product.name} (${product.dimension}): ${textureImages.length} images`);
      updated++;
    } catch (error) {
      console.error(`❌ Error updating ${product.name}:`, error.message);
    }
  } else {
    console.log(`⚠️  ${product.name} (${product.dimension}, ${product.surface}): No match found`);
  }
}

console.log(`\n============================================================`);
console.log(`📊 SUMMARY`);
console.log(`============================================================`);
console.log(`✅ Total products: ${products.length}`);
console.log(`🖼️  Products with texture images: ${matched}`);
console.log(`📝 Products updated: ${updated}`);
console.log(`\n✨ Done!`);

db.close();

