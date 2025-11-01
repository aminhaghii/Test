const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const db = new Database(path.join(__dirname, 'database.db'));

// Mapping of DECORED images to products based on dimension and name
const decoredMapping = {
  '30x30': {
    'aten': 'ATEN DARK GRAY',
    'helia': 'HELIA',
    'jenova': 'JENOA LIGHT GRAY',
    'kain dark': 'KAIN DARK GRAY',
    'kain light': 'KAIN LIGHT GRAY',
    'lamber': 'LAMBER WHITE',
    'siena': 'SIENA LIGHT GRAY'
  },
  '30x90': {
    'alvin': 'ALVIN',
    'arizona': 'ARIZONA',
    'arka': 'ARCA',
    'flora alder': 'ALDER WHITE',
    'flora gold': 'FLORA DECOR GOLD',
    'flora silver': 'FLORA DECOR SILVER',
    'linda': 'LINDA',
    'torino': 'TORINO'
  },
  '40x40': {
    'alborz': 'ALBORZ LIGHT GRAY',
    'aten': 'ATEN DARK GRAY',
    'berlin': 'BERLIN',
    'helia': 'HELIA',
    'jenova': 'JENOA LIGHT GRAY',
    'kain dark': 'KAIN DARK GRAY',
    'kain light': 'KAIN LIGHT GRAY',
    'lamber': 'LAMBER WHITE',
    'pars': 'PARS DARK GRAY',
    'persian dark': 'PERSION DARK GRAY',
    'siena': 'SIENA LIGHT GRAY'
  },
  '40x100': {
    'domini brown': 'DOMINI BROWN',
    'lauran': 'LAURAN',
    'liberia cream': 'LIBERIA CREAM'
  },
  '60x60': {
    'agra': 'AGRA',
    'anak': 'ANAK LIGHT GRAY',
    'biyanko': 'BIANCO WHITE',
    'carol': 'KAROL LIGHT GRAY',
    'dante': 'DANTEH LIGHT GRAY',
    'dayana': 'DAIANA',
    'diyako': 'DIYACO CREAM LIGHT',
    'eliza': 'HELENA LIGHT GRAY',
    'erik': 'ERIK CREAM LIGHT',
    'figaro': 'FIGARO LIGHT CREAM',
    'gloria': 'GELORIYA LIGHT CREAM',
    'julia': 'JULIA WHITE',
    'katrin': 'KATRIN LIGHT GRAY',
    'loman': 'LOMAN LIGHT GRAY',
    'mishel': 'MISHEL LIGHT GRAY',
    'nansi': 'NANCI LIGHT GRAY',
    'natali': 'NATALI',
    'parma': 'PARMA WHITE',
    'pedro': 'PEDRO',
    'pizzaro': 'PIZARO WHITE',
    'valencia': 'VALENCIA',
    'villas': 'VILAS LIGHT CREAMY',
    'zara': 'HELENA LIGHT GRAY'
  },
  '60x120': {
    'alfered': 'ALFERED',
    'beresha': 'BRESHA WHITE',
    'carlo': 'CARLO',
    'charlott': 'SHARLOTT',
    'flor': 'FLOR',
    'franco': 'FRANCO',
    'izmir': 'IZMIR LIGHT GRAY',
    'karolin': 'KAROLIN',
    'klara': 'KELARA WHITE',
    'leo': 'LEO WHITE',
    'lucas': 'LUCAS',
    'nikol': 'NIKOL',
    'raku': 'RAKU',
    'ramos': 'RAMOS',
    'roza': 'ROZA WHITE',
    'soufia': 'SOUFIA WHITE',
    'waldo': 'WALDO'
  },
  '80x80': {
    'kadia': 'KADIA',
    'kayan': 'KAYAN',
    'legro': 'LEGRO',
    'magnolia': 'MAGNOLIA',
    'marta': 'MARTA',
    'ramona': 'VALENCIA',
    'savana': 'SAVANA',
    'torento': 'TORENTO'
  },
  '100x100': {
    'kadia': 'KADIA',
    'magnolia': 'MAGNOLIA',
    'vegas': 'VELASKA DARK GRAY'
  }
};

// Function to normalize dimension format
function normalizeDimension(dim) {
  return dim.replace(/\s+/g, '').replace('x', 'x');
}

// Function to find matching product name
function findMatchingProduct(fileName, dimension) {
  const normalizedFile = fileName.toLowerCase()
    .replace(/\d+/g, '') // Remove numbers
    .replace(/\.(jpg|png)$/i, '') // Remove extension
    .trim();
  
  const dimMapping = decoredMapping[dimension];
  if (!dimMapping) return null;
  
  // Try exact match first
  for (const [key, productName] of Object.entries(dimMapping)) {
    if (normalizedFile.includes(key)) {
      return productName;
    }
  }
  
  return null;
}

// Function to scan DECORED folder and get all images
function getDecoredImages() {
  const decoredPath = path.join(__dirname, '..', 'DECORED');
  const imagesByProduct = {};
  
  // Dimension folders
  const dimFolders = {
    '30 30': '30x30',
    '30x90': '30x90',
    '40 x 40': '40x40',
    '40x100': '40x100',
    '60 x 60': '60x60',
    '60X120': '60x120',
    '80 x 80': '80x80',
    '100X100': '100x100'
  };
  
  for (const [folder, dimension] of Object.entries(dimFolders)) {
    const folderPath = path.join(decoredPath, folder);
    
    if (!fs.existsSync(folderPath)) continue;
    
    const files = fs.readdirSync(folderPath);
    
    for (const file of files) {
      if (!file.match(/\.(jpg|png)$/i)) continue;
      
      const productName = findMatchingProduct(file, dimension);
      
      if (productName) {
        const key = `${productName}|${dimension}`;
        if (!imagesByProduct[key]) {
          imagesByProduct[key] = [];
        }
        imagesByProduct[key].push(`/DECORED/${folder}/${file}`);
      }
    }
  }
  
  return imagesByProduct;
}

function addDecoredImages() {
  console.log('🖼️  Starting to add DECORED images to products...\n');
  
  try {
    const decoredImages = getDecoredImages();
    
    console.log(`📦 Found ${Object.keys(decoredImages).length} products with DECORED images\n`);
    
    let updatedCount = 0;
    let notFoundCount = 0;
    
    for (const [key, images] of Object.entries(decoredImages)) {
      const [productName, dimension] = key.split('|');
      
      // Find product in database - try multiple variations
      const searchPatterns = [
        productName,
        productName + ' LIGHT GRAY',
        productName + ' DARK GRAY',
        productName + ' WHITE',
        productName + ' CREAM'
      ];
      
      let product = null;
      for (const pattern of searchPatterns) {
        const result = db.prepare(
          'SELECT * FROM products WHERE name LIKE ? AND dimension = ? LIMIT 1'
        ).get(`%${pattern}%`, dimension);
        
        if (result) {
          product = result;
          break;
        }
      }
      
      if (!product) {
        console.log(`❌ Product not found: ${productName} (${dimension})`);
        notFoundCount++;
        continue;
      }
      
      // Update product with additional images
      const additionalImages = JSON.stringify(images);
      
      db.prepare(
        'UPDATE products SET additional_images = ? WHERE id = ?'
      ).run(additionalImages, product.id);
      
      console.log(`✅ ${product.name} (${dimension}): ${images.length} images added`);
      updatedCount++;
    }
    
    console.log(`\n✨ Summary:`);
    console.log(`  • Updated: ${updatedCount} products`);
    console.log(`  • Not found: ${notFoundCount} products`);
    console.log(`  • Total processed: ${Object.keys(decoredImages).length} entries`);
    
  } catch (error) {
    console.error('❌ Error adding DECORED images:', error);
    throw error;
  } finally {
    db.close();
  }
}

// Run the script
addDecoredImages();


