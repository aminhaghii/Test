const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const db = new Database(path.join(__dirname, 'database.db'));

// Product structure from ALMAS folder
const productsData = {
  '30x30': {
    'Matt': [
      { name: 'ATEN DARK GRAY', color: 'Dark Gray', count: 3 },
      { name: 'HELIA', color: 'Multi', count: 4 },
      { name: 'JENOA LIGHT GRAY', color: 'Light Gray', count: 3 },
      { name: 'KAIN DARK GRAY', color: 'Dark Gray', count: 4 },
      { name: 'KAIN LIGHT GRAY', color: 'Light Gray', count: 4 },
      { name: 'LAMBER WHITE', color: 'White', count: 6 },
      { name: 'SELENA WHITE', color: 'White', count: 4 },
      { name: 'SIENA LIGHT GRAY', color: 'Light Gray', count: 4 }
    ]
  },
  '30x90': {
    'Trans': [
      { name: 'ALDER WHITE', color: 'White', count: 4 },
      { name: 'ALDOR DECOR', color: 'Multi', count: 1 },
      { name: 'ALVIN DARK BROWN', color: 'Dark Brown', count: 3 },
      { name: 'ALVIN LIGHT BROWN', color: 'Light Brown', count: 3 },
      { name: 'ALVIN DECOR', color: 'Multi', count: 1 },
      { name: 'ARCA DARK GRAY', color: 'Dark Gray', count: 4 },
      { name: 'ARCA LIGHT GRAY', color: 'Light Gray', count: 4 },
      { name: 'ARCA LIGHT GRAY DECOR', color: 'Light Gray', count: 4 },
      { name: 'ARCA DECOR', color: 'Multi', count: 1 },
      { name: 'ARIZONA 001 LIGHT GRAY', color: 'Light Gray', count: 4 },
      { name: 'ARIZONA 002 DARK GRAY', color: 'Dark Gray', count: 4 },
      { name: 'ARIZONA 003 DARK GRAY', color: 'Dark Gray', count: 4 },
      { name: 'ARIZONA DECOR', color: 'Multi', count: 1 },
      { name: 'FELORA GOLD', color: 'Gold', count: 1 },
      { name: 'FELORA GOLD DECOR', color: 'Gold', count: 1 },
      { name: 'FELORA SILVER', color: 'Silver', count: 1 },
      { name: 'FELORA SILVER DECOR', color: 'Silver', count: 1 },
      { name: 'FLORA DECOR GOLD', color: 'Gold', count: 1 },
      { name: 'FLORA DECOR SILVER', color: 'Silver', count: 1 },
      { name: 'LINDA DARK GRAY', color: 'Dark Gray', count: 4 },
      { name: 'LINDA LIGHT GRAY', color: 'Light Gray', count: 4 },
      { name: 'LINDA LIGHT GRAY DECOR', color: 'Light Gray', count: 4 },
      { name: 'LINDA DECOR', color: 'Multi', count: 1 },
      { name: 'TORINO RUSTIC 001', color: 'Rustic', count: 1 },
      { name: 'TORINO RUSTIC 002', color: 'Rustic', count: 1 },
      { name: 'TORINO RUSTIC 003', color: 'Rustic', count: 1 },
      { name: 'TORINO DECOR 001', color: 'Multi', count: 1 },
      { name: 'TORINO DECOR 002', color: 'Multi', count: 1 },
      { name: 'TORINO DECOR 003', color: 'Multi', count: 1 },
      { name: 'TURINO 002 DARK GRAY ROSTIC', color: 'Dark Gray', count: 4 }
    ]
  },
  '40x40': {
    'Matt': [
      { name: 'ALBORZ LIGHT GRAY', color: 'Light Gray', count: 3 },
      { name: 'BERLIN DARK GRAY', color: 'Dark Gray', count: 3 },
      { name: 'BERLIN LIGHT GRAY', color: 'Light Gray', count: 3 },
      { name: 'PARS DARK GRAY', color: 'Dark Gray', count: 3 },
      { name: 'PERSION DARK GRAY', color: 'Dark Gray', count: 3 }
    ]
  },
  '40x100': {
    'No Surface': [
      { name: 'DOMINI BROWN', color: 'Brown', count: 5 },
      { name: 'DOMINI CREAM', color: 'Cream', count: 5 },
      { name: 'LAURAN', color: 'Multi', count: 4 },
      { name: 'LIBERIA BROWN', color: 'Brown', count: 5 },
      { name: 'LIBERIA CREAM', color: 'Cream', count: 5 }
    ]
  },
  '60x60': {
    'Matt': [
      { name: 'ANAK LIGHT GRAY', color: 'Light Gray', count: 3 },
      { name: 'DANTEH LIGHT GRAY', color: 'Light Gray', count: 4 },
      { name: 'LOMAN LIGHT GRAY', color: 'Light Gray', count: 4 },
      { name: 'MELINA DARK GRAY', color: 'Dark Gray', count: 2 },
      { name: 'MISHEL LIGHT GRAY', color: 'Light Gray', count: 4 },
      { name: 'NANCI LIGHT GRAY', color: 'Light Gray', count: 4 },
      { name: 'NATALI DARK GRAY', color: 'Dark Gray', count: 3 },
      { name: 'NATALI LIGHT GRAY', color: 'Light Gray', count: 3 }
    ],
    'Trans': [
      { name: 'AGRA LIGHT GRAY', color: 'Light Gray', count: 2 },
      { name: 'AGRA TOSI ROSHAN MATT', color: 'Light Gray', count: 2 },
      { name: 'BIANCO WHITE', color: 'White', count: 4 },
      { name: 'DAIANA DARK GRAY', color: 'Dark Gray', count: 4 },
      { name: 'DAIANA LIGHT GRAY', color: 'Light Gray', count: 4 },
      { name: 'DIYACO CREAM LIGHT', color: 'Cream', count: 4 },
      { name: 'ERIK CREAM LIGHT', color: 'Cream', count: 3 },
      { name: 'FIGARO LIGHT CREAM', color: 'Cream', count: 4 },
      { name: 'GELORIYA LIGHT CREAM', color: 'Cream', count: 4 },
      { name: 'HELENA LIGHT GRAY', color: 'Light Gray', count: 4 },
      { name: 'JULIA WHITE', color: 'White', count: 4 },
      { name: 'KAROL LIGHT GRAY', color: 'Light Gray', count: 4 },
      { name: 'KATRIN LIGHT GRAY', color: 'Light Gray', count: 1 },
      { name: 'PARMA WHITE', color: 'White', count: 4 },
      { name: 'PIZARO WHITE', color: 'White', count: 3 },
      { name: 'VILAS LIGHT CREAMY', color: 'Cream', count: 1 }
    ]
  },
  '60x120': {
    'Matt': [
      { name: 'BETONIX', color: 'Multi', count: 5 },
      { name: 'BRESHA WHITE', color: 'White', count: 4 },
      { name: 'CARLO DARK GRAY', color: 'Dark Gray', count: 4 },
      { name: 'CARLO LIGHT GRAY', color: 'Light Gray', count: 4 },
      { name: 'IZMIR LIGHT GRAY', color: 'Light Gray', count: 4 },
      { name: 'MILAN ROSHAN', color: 'Light', count: 5 },
      { name: 'MILAN TIRE', color: 'Dark', count: 5 },
      { name: 'RAKU DARK GRAY', color: 'Dark Gray', count: 4 },
      { name: 'RAKU LIGHT GRAY', color: 'Light Gray', count: 4 },
      { name: 'RAKU LIGHT GRAY DECOR', color: 'Light Gray', count: 2 },
      { name: 'VALENCIA', color: 'Multi', count: 6 },
      { name: 'WALDO DARK GRAY', color: 'Dark Gray', count: 2 },
      { name: 'WALDO LIGHT GRAY', color: 'Light Gray', count: 4 }
    ],
    'Polished': [
      { name: 'AIRISH', color: 'Multi', count: 1 },
      { name: 'BERMEN', color: 'Multi', count: 4 },
      { name: 'BOB GOLD', color: 'Gold', count: 1 },
      { name: 'FLOR BLACK', color: 'Black', count: 5 },
      { name: 'FLOR LIGHT', color: 'Light', count: 6 },
      { name: 'FRANCO', color: 'Multi', count: 5 },
      { name: 'GABRIELA WHITE', color: 'White', count: 1 },
      { name: 'GABRIS', color: 'Multi', count: 1 },
      { name: 'GALLAXY', color: 'Multi', count: 5 },
      { name: 'HAMILTON', color: 'Multi', count: 5 },
      { name: 'HECTOR', color: 'Multi', count: 6 },
      { name: 'JANET BLACK', color: 'Black', count: 1 },
      { name: 'KADIA', color: 'Multi', count: 5 },
      { name: 'KAMILA DARK', color: 'Dark', count: 1 },
      { name: 'KAMILA LIGHT', color: 'Light', count: 1 },
      { name: 'KARAN', color: 'Multi', count: 4 },
      { name: 'KARMEN', color: 'Multi', count: 5 },
      { name: 'KAROLIN', color: 'Multi', count: 5 },
      { name: 'LAVIN', color: 'Multi', count: 5 },
      { name: 'LION DARK BLUE', color: 'Dark Blue', count: 1 },
      { name: 'LION DARK GRAY', color: 'Dark Gray', count: 1 },
      { name: 'LION LIGHT BLUE', color: 'Light Blue', count: 1 },
      { name: 'LION LIGHT GRAY', color: 'Light Gray', count: 1 },
      { name: 'LUCAS', color: 'Multi', count: 6 },
      { name: 'MAGNOLIA', color: 'Multi', count: 5 },
      { name: 'MAGNOLIA LIGHT', color: 'Light', count: 4 },
      { name: 'MERINOUS', color: 'Multi', count: 5 },
      { name: 'MICKY', color: 'Multi', count: 6 },
      { name: 'PATRIC BLACK', color: 'Black', count: 1 },
      { name: 'PAULA', color: 'Multi', count: 5 },
      { name: 'PEDRO', color: 'Multi', count: 5 },
      { name: 'PICASO', color: 'Multi', count: 1 },
      { name: 'RAMOS', color: 'Multi', count: 4 },
      { name: 'RICHMOND', color: 'Multi', count: 1 },
      { name: 'ROMANO DARK', color: 'Dark', count: 1 },
      { name: 'ROMANO LIGHT', color: 'Light', count: 1 },
      { name: 'SCADA', color: 'Multi', count: 2 },
      { name: 'SHARLOTT', color: 'Multi', count: 5 },
      { name: 'SHERLI', color: 'Multi', count: 1 },
      { name: 'SILVANA BLACK', color: 'Black', count: 5 },
      { name: 'VALERMO DARK BOOKMATCH', color: 'Dark', count: 2 },
      { name: 'VALERMO LIGHT BOOKMATCH', color: 'Light', count: 2 }
    ],
    'Trans': [
      { name: 'ALFERED DARK GRAY', color: 'Dark Gray', count: 2 },
      { name: 'ALFERED LIGHT GRAY', color: 'Light Gray', count: 4 },
      { name: 'ANDO', color: 'Multi', count: 5 },
      { name: 'KAROLIN CREAM LIGHT', color: 'Cream', count: 4 },
      { name: 'KAROLIN DARK GRAY', color: 'Dark Gray', count: 2 },
      { name: 'KAROLIN LIGHT GRAY', color: 'Light Gray', count: 4 },
      { name: 'KELARA WHITE', color: 'White', count: 4 },
      { name: 'KENZO-R', color: 'Multi', count: 5 },
      { name: 'KENZO-T', color: 'Multi', count: 4 },
      { name: 'LEO WHITE', color: 'White', count: 4 },
      { name: 'MONIKA', color: 'Multi', count: 4 },
      { name: 'NIKOL DARK GRAY', color: 'Dark Gray', count: 4 },
      { name: 'NIKOL LIGHT GRAY', color: 'Light Gray', count: 4 },
      { name: 'ROZA WHITE', color: 'White', count: 4 },
      { name: 'SOUFIA WHITE', color: 'White', count: 4 },
      { name: 'VALERIA', color: 'Multi', count: 5 }
    ]
  },
  '80x80': {
    'Polished': [
      { name: 'HELMA', color: 'Multi', count: 5 },
      { name: 'KADIA', color: 'Multi', count: 3 },
      { name: 'KAYAN', color: 'Multi', count: 5 },
      { name: 'LEGRO', color: 'Multi', count: 5 },
      { name: 'MAGNOLIA', color: 'Multi', count: 5 },
      { name: 'MARTA', color: 'Multi', count: 6 },
      { name: 'PEDRO', color: 'Multi', count: 4 },
      { name: 'SALTIS', color: 'Multi', count: 1 },
      { name: 'SAVANA', color: 'Multi', count: 6 },
      { name: 'TORENTO', color: 'Multi', count: 6 },
      { name: 'VALENCIA', color: 'Multi', count: 4 },
      { name: 'VALERIA', color: 'Multi', count: 5 }
    ]
  },
  '100x100': {
    'Polished': [
      { name: 'ALVIN', color: 'Multi', count: 1 },
      { name: 'CENA CREAM', color: 'Cream', count: 4 },
      { name: 'CHRISTIN', color: 'Multi', count: 1 },
      { name: 'EMILIA GOLD', color: 'Gold', count: 1 },
      { name: 'FIDENZA LIGHT CREAM', color: 'Light Cream', count: 1 },
      { name: 'FIDENZA LIGHT GRAY', color: 'Light Gray', count: 1 },
      { name: 'KEVIN', color: 'Multi', count: 1 },
      { name: 'ONIX CREAM', color: 'Cream', count: 4 },
      { name: 'VELASKA DARK GRAY', color: 'Dark Gray', count: 3 }
    ]
  }
};

function seedRealProducts() {
  console.log('🚀 Starting to seed real products from ALMAS folder...\n');

  try {
    // Clear existing products
    console.log('🗑️  Clearing existing products...');
    db.prepare('DELETE FROM products').run();
    // Reset autoincrement counter if table exists
    try {
      db.prepare('DELETE FROM sqlite_sequence WHERE name = "products"').run();
    } catch (e) {
      // sqlite_sequence doesn't exist if no AUTOINCREMENT columns used
    }
    console.log('✅ Existing products cleared\n');

    let totalProducts = 0;
    let productId = 1;

    // Insert products for each dimension/surface combination
    for (const [dimension, surfaces] of Object.entries(productsData)) {
      console.log(`📐 Processing ${dimension}...`);
      
      for (const [surface, products] of Object.entries(surfaces)) {
        const surfaceType = surface === 'No Surface' ? 'Matt' : surface;
        
        for (const product of products) {
          const slug = `${product.name.toLowerCase().replace(/\s+/g, '-')}-${dimension.replace('x', '-')}`;
          const imagePath = `/ALMAS/${dimension}/${surface === 'No Surface' ? '' : surface + '/'}${product.name} (1).jpg`;
          
          // Determine body type based on dimension and surface
          let bodyType = 'Porcelain';
          if (dimension === '30x30' || dimension === '30x90' || dimension === '40x40') {
            bodyType = 'White Body';
          }
          
          const stmt = db.prepare(`
            INSERT INTO products (
              id, name, slug, dimension, surface, body_type, color, 
              category, price, stock_quantity, image_url, description,
              technical_specs, is_featured, is_active
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `);

          stmt.run(
            productId,
            product.name,
            slug,
            dimension,
            surfaceType,
            bodyType,
            product.color,
            'Wall Tiles',
            null, // price
            100, // stock
            imagePath,
            `${product.name} - Premium ${surfaceType} ceramic tile in ${dimension} size`,
            JSON.stringify({
              dimension: dimension,
              surface: surfaceType,
              bodyType: bodyType,
              waterAbsorption: bodyType === 'Porcelain' ? '< 0.5%' : '< 10%',
              breakingStrength: bodyType === 'Porcelain' ? '> 1300 N' : '> 600 N',
              images: product.count
            }),
            productId <= 50 ? 1 : 0, // First 50 as featured
            1 // active
          );

          productId++;
          totalProducts++;
        }
        
        console.log(`  ✓ ${surface}: ${products.length} products`);
      }
      console.log('');
    }

    console.log(`\n✨ Successfully seeded ${totalProducts} products!`);
    console.log('\n📊 Summary:');
    console.log('  • 30x30 Matt: 8 products');
    console.log('  • 30x90 Trans: 30 products');
    console.log('  • 40x40 Matt: 5 products');
    console.log('  • 40x100: 5 products');
    console.log('  • 60x60 Matt: 8 products');
    console.log('  • 60x60 Trans: 16 products');
    console.log('  • 60x120 Matt: 13 products');
    console.log('  • 60x120 Polished: 42 products');
    console.log('  • 60x120 Trans: 16 products');
    console.log('  • 80x80 Polished: 12 products');
    console.log('  • 100x100 Polished: 9 products');
    console.log(`  ────────────────────────`);
    console.log(`  Total: ${totalProducts} products`);

  } catch (error) {
    console.error('❌ Error seeding products:', error);
    throw error;
  } finally {
    db.close();
  }
}

// Run the seeder
seedRealProducts();

