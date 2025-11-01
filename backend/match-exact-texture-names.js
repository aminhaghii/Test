const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database.db');
const db = new Database(dbPath);

const ALMAS_DIR = path.join(__dirname, '..', 'ALMAS');

function normalizeName(name) {
  return name
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, '') // Remove special chars
    .replace(/\s+/g, ' ') // Multiple spaces to one
    .trim();
}

function extractProductNameFromImage(imageFile) {
  return normalizeName(imageFile.replace(/\.(jpg|jpeg)$/i, ''));
}

function getImagesInFolder(folderPath) {
  if (!fs.existsSync(folderPath)) return [];
  
  const files = fs.readdirSync(folderPath);
  const imageFiles = files.filter(f => /\.(jpg|jpeg)$/i.test(f));
  
  const result = [];
  for (const imageFile of imageFiles) {
    const productName = extractProductNameFromImage(imageFile);
    const imageUrl = folderPath.replace(ALMAS_DIR + path.sep, '').replace(/\\/g, '/');
    result.push({
      name: productName,
      url: `/ALMAS/${imageUrl}/${imageFile}`
    });
  }
  
  return result;
}

console.log('🔍 Finding exact name matches for texture images...\n');

// Get all texture images organized by folder
const allImages = {
  '30x30': getImagesInFolder(path.join(ALMAS_DIR, '30x30', 'Matt')),
  '30x90': getImagesInFolder(path.join(ALMAS_DIR, '30x90', 'Trans')),
  '40x40': getImagesInFolder(path.join(ALMAS_DIR, '40x40', 'Matt')),
  '40x100': getImagesInFolder(path.join(ALMAS_DIR, '40x100')),
  '60x60': [
    ...getImagesInFolder(path.join(ALMAS_DIR, '60x60', 'Matt')),
    ...getImagesInFolder(path.join(ALMAS_DIR, '60x60', 'Trans'))
  ],
  '60x120': [
    ...getImagesInFolder(path.join(ALMAS_DIR, '60x120', '60x120 Matt')),
    ...getImagesInFolder(path.join(ALMAS_DIR, '60x120', '60x120 Polished')),
    ...getImagesInFolder(path.join(ALMAS_DIR, '60x120', '60x120Trans'))
  ],
  '80x80': getImagesInFolder(path.join(ALMAS_DIR, '80x80', 'Polished')),
  '100x100': getImagesInFolder(path.join(ALMAS_DIR, '100 100', 'Polished'))
};

console.log('Available texture images by dimension:');
for (const [dim, images] of Object.entries(allImages)) {
  console.log(`  ${dim}: ${images.length} images`);
}
console.log('\n');

// Get all products
const products = db.prepare('SELECT id, name, dimension, surface FROM products').all();

let matched = 0;
let totalMatches = 0;

for (const product of products) {
  const productNormalized = normalizeName(product.name);
  const dimensionImages = allImages[product.dimension] || [];
  
  const matchingImages = dimensionImages.filter(img => {
    return img.name === productNormalized;
  });
  
  if (matchingImages.length > 0) {
    matched++;
    totalMatches += matchingImages.length;
    const textureImagesJson = JSON.stringify(matchingImages.map(img => img.url));
    
    db.prepare('UPDATE products SET texture_images = ? WHERE id = ?').run(textureImagesJson, product.id);
    console.log(`✅ ${product.name} (${product.dimension}): ${matchingImages.length} exact matches`);
  }
}

console.log(`\n============================================================`);
console.log(`📊 SUMMARY`);
console.log(`============================================================`);
console.log(`✅ Total products: ${products.length}`);
console.log(`🎯 Products with exact name matches: ${matched}`);
console.log(`🖼️  Total texture images assigned: ${totalMatches}`);
console.log(`\n✨ Done!`);

db.close();

