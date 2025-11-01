const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Initialize database
const dbPath = path.join(__dirname, 'database.db');
const db = new Database(dbPath);

// Mapping between DECORED folder names and database dimensions
const dimensionMapping = {
  '100X100': '100x100',
  '30 30': '30x30',
  '30x90': '30x90',
  '40 x 40': '40x40',
  '40x100': '40x100',
  '60 x 60': '60x60',
  '60X120': '60x120',
  '80 x 80': '80x80'
};

// Normalize product name for matching
// Removes spaces, dashes, numbers at end, converts to lowercase
function normalizeProductName(name) {
  return name
    .toLowerCase()
    .replace(/\.(jpg|jpeg|png|webp)$/i, '') // Remove file extension
    .replace(/\s+/g, '') // Remove all spaces
    .replace(/-/g, '') // Remove dashes
    .replace(/\d+$/g, '') // Remove trailing numbers (like 2, 3, etc.)
    .trim();
}

// Check if a filename matches a product name
function isMatch(fileName, productName) {
  const normalizedFileName = normalizeProductName(fileName);
  const normalizedProductName = normalizeProductName(productName);
  
  // Direct match
  if (normalizedFileName === normalizedProductName) {
    return true;
  }
  
  // Check if one contains the other (for partial matches)
  if (normalizedFileName.includes(normalizedProductName) || 
      normalizedProductName.includes(normalizedFileName)) {
    return true;
  }
  
  return false;
}

// Find the best matching image for a product
function findBestMatch(productName, availableFiles) {
  // First, try to find exact match
  for (const file of availableFiles) {
    const normalizedFile = normalizeProductName(file);
    const normalizedProduct = normalizeProductName(productName);
    
    if (normalizedFile === normalizedProduct) {
      return file;
    }
  }
  
  // Then, try partial match (prefer files without numbers)
  const filesWithoutNumbers = availableFiles.filter(f => !/\d+\.(jpg|jpeg|png)$/i.test(f));
  for (const file of filesWithoutNumbers) {
    if (isMatch(file, productName)) {
      return file;
    }
  }
  
  // Finally, try any match
  for (const file of availableFiles) {
    if (isMatch(file, productName)) {
      return file;
    }
  }
  
  return null;
}

function matchDecorImages() {
  console.log('🎨 Starting DECOR images matching...\n');
  
  const decorPath = path.join(__dirname, '..', 'DECORED');
  
  if (!fs.existsSync(decorPath)) {
    console.error('❌ DECORED folder not found!');
    return;
  }
  
  let totalMatched = 0;
  let totalUnmatched = 0;
  const unmatchedProducts = [];
  
  // Get all products from database
  const allProducts = db.prepare('SELECT id, name, dimension FROM products ORDER BY dimension, name').all();
  console.log(`📦 Total products in database: ${allProducts.length}\n`);
  
  // Process each dimension folder
  const decorFolders = fs.readdirSync(decorPath);
  
  for (const folder of decorFolders) {
    const folderPath = path.join(decorPath, folder);
    
    if (!fs.statSync(folderPath).isDirectory()) {
      continue;
    }
    
    // Get the database dimension for this folder
    const dbDimension = dimensionMapping[folder];
    
    if (!dbDimension) {
      console.log(`⚠️  Unknown dimension folder: ${folder}, skipping...`);
      continue;
    }
    
    console.log(`\n📁 Processing ${folder} (${dbDimension})...`);
    
    // Get all image files in this folder
    const imageFiles = fs.readdirSync(folderPath)
      .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
    
    console.log(`   Found ${imageFiles.length} decor images`);
    
    // Get products for this dimension
    const productsForDimension = allProducts.filter(p => p.dimension === dbDimension);
    console.log(`   Found ${productsForDimension.length} products in database`);
    
    let matchedInDimension = 0;
    
    // Try to match each product with an image
    for (const product of productsForDimension) {
      const matchedImage = findBestMatch(product.name, imageFiles);
      
      if (matchedImage) {
        const decorImageUrl = `/DECORED/${folder}/${matchedImage}`;
        
        // Update product with decor image
        try {
          db.prepare('UPDATE products SET decor_image_url = ? WHERE id = ?')
            .run(decorImageUrl, product.id);
          
          console.log(`   ✅ ${product.name} -> ${matchedImage}`);
          matchedInDimension++;
          totalMatched++;
        } catch (error) {
          console.error(`   ❌ Error updating ${product.name}:`, error.message);
        }
      } else {
        console.log(`   ⚠️  No match found for: ${product.name}`);
        unmatchedProducts.push({ dimension: dbDimension, name: product.name });
        totalUnmatched++;
      }
    }
    
    console.log(`   ${matchedInDimension}/${productsForDimension.length} products matched in ${dbDimension}`);
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 MATCHING SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Total matched: ${totalMatched}`);
  console.log(`⚠️  Total unmatched: ${totalUnmatched}`);
  console.log(`📈 Match rate: ${((totalMatched / allProducts.length) * 100).toFixed(2)}%`);
  
  if (unmatchedProducts.length > 0) {
    console.log('\n⚠️  UNMATCHED PRODUCTS:');
    unmatchedProducts.forEach(p => {
      console.log(`   - ${p.dimension}: ${p.name}`);
    });
  }
  
  console.log('\n✨ Decor images matching completed!');
}

// Run the script
try {
  matchDecorImages();
} catch (error) {
  console.error('❌ Error:', error);
  process.exit(1);
}

