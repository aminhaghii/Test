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

// Extract product name from filename
function extractProductName(filename, keepNumbers = false) {
  // Remove extension
  let name = filename.replace(/\.(jpg|jpeg|png|webp)$/i, '');
  
  // If keepNumbers is false, remove trailing numbers (like 2, 3, etc.)
  if (!keepNumbers) {
    name = name.replace(/\s*\d+$/, '');
  }
  
  // Convert to uppercase for consistency
  name = name.toUpperCase().trim();
  
  return name;
}

// Determine color from filename
function determineColor(filename) {
  const lower = filename.toLowerCase();
  
  if (lower.includes('white')) return 'White';
  if (lower.includes('cream')) return 'Cream';
  if (lower.includes('light') && lower.includes('gray')) return 'Light Gray';
  if (lower.includes('dark') && lower.includes('gray')) return 'Dark Gray';
  if (lower.includes('light')) return 'Light';
  if (lower.includes('dark')) return 'Dark';
  if (lower.includes('gray')) return 'Gray';
  if (lower.includes('brown')) return 'Brown';
  if (lower.includes('beige')) return 'Beige';
  
  return 'Natural';
}

// Determine surface type
function determineSurface(filename) {
  const lower = filename.toLowerCase();
  
  if (lower.includes('matt')) return 'Matt';
  if (lower.includes('polished') || lower.includes('glossy') || lower.includes('baragh')) return 'Polished';
  if (lower.includes('trans')) return 'Trans';
  
  // Default based on color/appearance
  if (lower.includes('light') || lower.includes('cream')) return 'Matt';
  
  return 'Polished';
}

// Generate slug
function generateSlug(name, dimension, surface) {
  return `${name}-${dimension}-${surface}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Get specifications based on dimension
function getSpecifications(dimension) {
  const specs = {
    '30x30': { thickness: 8.5, absorption_rate: '3-6' },
    '40x40': { thickness: 13.5, absorption_rate: '6-10' },
    '60x60': { thickness: 10.5, absorption_rate: '3-6' },
    '40x120': { thickness: 11, absorption_rate: '3-6' },
    '60x120': { thickness: 10, absorption_rate: '6-10' },
    '30x60': { thickness: 8.5, absorption_rate: '11-18' },
    '30x90': { thickness: 9.5, absorption_rate: '11-18' }
  };
  
  return specs[dimension] || { thickness: null, absorption_rate: null };
}

function seedFromDecored() {
  console.log('🌱 Starting seed from DECORED images...\n');
  
  const decorPath = path.join(__dirname, '..', 'DECORED');
  
  if (!fs.existsSync(decorPath)) {
    console.error('❌ DECORED folder not found!');
    return;
  }
  
  // Clear existing products
  console.log('🗑️  Clearing existing products...');
  db.prepare('DELETE FROM products').run();
  console.log('✅ Cleared\n');
  
  const insertStmt = db.prepare(`
    INSERT INTO products (
      id, name, slug, dimension, surface, body_type, color, category,
      description, decor_image_url, thickness, absorption_rate,
      is_featured, is_active, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `);
  
  let totalInserted = 0;
  const decorFolders = fs.readdirSync(decorPath);
  
  // Process each dimension folder
  for (const folder of decorFolders) {
    const folderPath = path.join(decorPath, folder);
    
    if (!fs.statSync(folderPath).isDirectory()) {
      continue;
    }
    
    const dbDimension = dimensionMapping[folder];
    
    if (!dbDimension) {
      console.log(`⚠️  Unknown dimension folder: ${folder}, skipping...`);
      continue;
    }
    
    console.log(`📁 Processing ${folder} (${dbDimension})...`);
    
    // Get all image files
    const imageFiles = fs.readdirSync(folderPath)
      .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
    
    console.log(`   Found ${imageFiles.length} images`);
    
    let insertedInDimension = 0;
    
    // Create a product for each image
    for (const imageFile of imageFiles) {
      const productName = extractProductName(imageFile);
      const productNameWithNumber = extractProductName(imageFile, true); // Keep numbers for unique name
      const color = determineColor(imageFile);
      const surface = determineSurface(imageFile);
      const slug = generateSlug(productNameWithNumber, dbDimension, surface); // Use name with numbers for unique slug
      const decorImageUrl = `/DECORED/${folder}/${imageFile}`;
      
      // Get specifications
      const specs = getSpecifications(dbDimension);
      
      // Determine body type based on surface
      // Polished = Porcelain, everything else = White Body
      const bodyType = surface === 'Polished' ? 'Porcelain' : 'White Body';
      const [width] = dbDimension.split('x').map(Number);
      const category = width >= 60 ? 'Floor Tiles' : 'Wall Tiles';
      
      // Create description with specs
      const description = `Premium ${surface} ${bodyType} tile in ${color} color. Size: ${dbDimension}cm. Thickness: ${specs.thickness}mm. Absorption rate: ${specs.absorption_rate}%. Perfect for ${category.toLowerCase()}.`;
      
      // Generate unique ID
      const id = `prod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      try {
        insertStmt.run(
          id,
          productName, // Use name without numbers for display
          slug,
          dbDimension,
          surface,
          bodyType,
          color,
          category,
          description,
          decorImageUrl,
          specs.thickness,
          specs.absorption_rate,
          insertedInDimension < 2 ? 1 : 0, // Make first 2 featured
          1 // is_active
        );
        
        insertedInDimension++;
        totalInserted++;
        
        console.log(`   ✅ ${productName} (${surface}, ${color})`);
      } catch (error) {
        console.error(`   ❌ Error inserting ${productName}:`, error.message);
      }
    }
    
    console.log(`   ${insertedInDimension} products created in ${dbDimension}\n`);
  }
  
  // Summary
  console.log('='.repeat(60));
  console.log('📊 SEED SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Total products created: ${totalInserted}`);
  console.log(`🎨 All products have decor images from DECORED folder`);
  console.log('\n✨ Seed from DECORED completed!');
}

// Run the script
try {
  seedFromDecored();
} catch (error) {
  console.error('❌ Error:', error);
  process.exit(1);
}

