const { db } = require('./database');
const { v4: uuidv4 } = require('uuid');

// Real product data based on the site's actual products
const products = [
  // 30x30 Products
  {
    name: 'ANAK LIGHT GRAY',
    dimension: '30x30',
    surface: 'Matt',
    body_type: 'Ceramic',
    color: 'Gray',
    category: 'Wall Tiles',
    description: 'Light gray ceramic tile with modern aesthetic',
    is_featured: true,
    is_active: true
  },
  {
    name: 'ANAK CREAM',
    dimension: '30x30',
    surface: 'Matt',
    body_type: 'Ceramic',
    color: 'Cream',
    category: 'Wall Tiles',
    description: 'Elegant cream ceramic tile',
    is_featured: false,
    is_active: true
  },
  {
    name: 'BIANCO',
    dimension: '30x30',
    surface: 'Glossy',
    body_type: 'Ceramic',
    color: 'White',
    category: 'Wall Tiles',
    description: 'Pure white glossy ceramic tile',
    is_featured: true,
    is_active: true
  },
  
  // 30x90 Products
  {
    name: 'CALACATTA GOLD',
    dimension: '30x90',
    surface: 'Polished',
    body_type: 'Porcelain',
    color: 'White',
    category: 'Wall Tiles',
    description: 'Luxurious marble-effect porcelain with gold veining',
    is_featured: true,
    is_active: true
  },
  {
    name: 'STATUARIO',
    dimension: '30x90',
    surface: 'Polished',
    body_type: 'Porcelain',
    color: 'White',
    category: 'Wall Tiles',
    description: 'Classic Italian marble look',
    is_featured: true,
    is_active: true
  },
  {
    name: 'CARRARA WHITE',
    dimension: '30x90',
    surface: 'Matt',
    body_type: 'Porcelain',
    color: 'White',
    category: 'Wall Tiles',
    description: 'Elegant Carrara marble effect',
    is_featured: false,
    is_active: true
  },
  
  // 40x40 Products
  {
    name: 'TERRAZZO MIX',
    dimension: '40x40',
    surface: 'Matt',
    body_type: 'Ceramic',
    color: 'Multi',
    category: 'Floor Tiles',
    description: 'Modern terrazzo pattern',
    is_featured: false,
    is_active: true
  },
  {
    name: 'CONCRETE GRAY',
    dimension: '40x40',
    surface: 'Matt',
    body_type: 'Porcelain',
    color: 'Gray',
    category: 'Floor Tiles',
    description: 'Industrial concrete effect',
    is_featured: false,
    is_active: true
  },
  
  // 60x60 Products
  {
    name: 'EMPERADOR DARK',
    dimension: '60x60',
    surface: 'Polished',
    body_type: 'Porcelain',
    color: 'Brown',
    category: 'Floor Tiles',
    description: 'Luxurious dark marble effect',
    is_featured: true,
    is_active: true
  },
  {
    name: 'NERO MARQUINA',
    dimension: '60x60',
    surface: 'Polished',
    body_type: 'Porcelain',
    color: 'Black',
    category: 'Floor Tiles',
    description: 'Elegant black marble with white veining',
    is_featured: true,
    is_active: true
  },
  {
    name: 'TRAVERTINO BEIGE',
    dimension: '60x60',
    surface: 'Matt',
    body_type: 'Porcelain',
    color: 'Beige',
    category: 'Floor Tiles',
    description: 'Natural travertine stone effect',
    is_featured: false,
    is_active: true
  },
  {
    name: 'WOOD OAK',
    dimension: '60x60',
    surface: 'Matt',
    body_type: 'Porcelain',
    color: 'Brown',
    category: 'Floor Tiles',
    description: 'Wood-look porcelain tile',
    is_featured: false,
    is_active: true
  },
  
  // 60x120 Products
  {
    name: 'MARBLE ONYX',
    dimension: '60x120',
    surface: 'Polished',
    body_type: 'Porcelain',
    color: 'White',
    category: 'Floor Tiles',
    description: 'Premium onyx marble effect',
    is_featured: true,
    is_active: true
  },
  {
    name: 'SLATE GRAY',
    dimension: '60x120',
    surface: 'Textured',
    body_type: 'Porcelain',
    color: 'Gray',
    category: 'Floor Tiles',
    description: 'Natural slate texture',
    is_featured: false,
    is_active: true
  },
  {
    name: 'SANDSTONE BEIGE',
    dimension: '60x120',
    surface: 'Matt',
    body_type: 'Porcelain',
    color: 'Beige',
    category: 'Floor Tiles',
    description: 'Warm sandstone effect',
    is_featured: false,
    is_active: true
  },
  
  // 80x80 Products
  {
    name: 'ALABASTER WHITE',
    dimension: '80x80',
    surface: 'Polished',
    body_type: 'Porcelain',
    color: 'White',
    category: 'Floor Tiles',
    description: 'Pure alabaster white',
    is_featured: true,
    is_active: true
  },
  {
    name: 'BASALT BLACK',
    dimension: '80x80',
    surface: 'Matt',
    body_type: 'Porcelain',
    color: 'Black',
    category: 'Floor Tiles',
    description: 'Deep basalt black',
    is_featured: false,
    is_active: true
  },
  {
    name: 'LIMESTONE GRAY',
    dimension: '80x80',
    surface: 'Matt',
    body_type: 'Porcelain',
    color: 'Gray',
    category: 'Floor Tiles',
    description: 'Natural limestone effect',
    is_featured: false,
    is_active: true
  },
  
  // 100x100 Products
  {
    name: 'PREMIUM CALACATTA',
    dimension: '100x100',
    surface: 'Polished',
    body_type: 'Porcelain',
    color: 'White',
    category: 'Floor Tiles',
    description: 'Extra large premium Calacatta marble',
    is_featured: true,
    is_active: true
  },
  {
    name: 'GRAND ONYX',
    dimension: '100x100',
    surface: 'Polished',
    body_type: 'Porcelain',
    color: 'Black',
    category: 'Floor Tiles',
    description: 'Luxurious large format onyx',
    is_featured: true,
    is_active: true
  },
  {
    name: 'PLATINUM GRAY',
    dimension: '100x100',
    surface: 'Polished',
    body_type: 'Porcelain',
    color: 'Gray',
    category: 'Floor Tiles',
    description: 'Sophisticated platinum gray',
    is_featured: false,
    is_active: true
  },

  // Additional diverse products
  {
    name: 'VERDE ALPI',
    dimension: '60x60',
    surface: 'Polished',
    body_type: 'Porcelain',
    color: 'Green',
    category: 'Floor Tiles',
    description: 'Beautiful green marble effect',
    is_featured: false,
    is_active: true
  },
  {
    name: 'ROSSO LEVANTO',
    dimension: '60x60',
    surface: 'Polished',
    body_type: 'Porcelain',
    color: 'Red',
    category: 'Floor Tiles',
    description: 'Elegant red marble',
    is_featured: false,
    is_active: true
  },
  {
    name: 'PEARL WHITE',
    dimension: '30x90',
    surface: 'Satin',
    body_type: 'Ceramic',
    color: 'White',
    category: 'Wall Tiles',
    description: 'Pearl finish white tile',
    is_featured: false,
    is_active: true
  },
  {
    name: 'ANTHRACITE',
    dimension: '60x120',
    surface: 'Matt',
    body_type: 'Porcelain',
    color: 'Black',
    category: 'Floor Tiles',
    description: 'Deep anthracite color',
    is_featured: false,
    is_active: true
  },
  {
    name: 'HONEY ONYX',
    dimension: '80x80',
    surface: 'Polished',
    body_type: 'Porcelain',
    color: 'Yellow',
    category: 'Floor Tiles',
    description: 'Warm honey onyx effect',
    is_featured: false,
    is_active: true
  }
];

function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function seedProducts() {
  console.log('🌱 Starting product seeding...');
  
  try {
    // Clear existing products
    db.prepare('DELETE FROM products').run();
    console.log('✅ Cleared existing products');
    
    // Insert products
    const insertStmt = db.prepare(`
      INSERT INTO products (
        id, name, slug, dimension, surface, body_type, color, category,
        description, is_featured, is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);
    
    let count = 0;
    for (const product of products) {
      const id = uuidv4();
      const slug = generateSlug(product.name);
      
      insertStmt.run(
        id,
        product.name,
        slug,
        product.dimension,
        product.surface,
        product.body_type,
        product.color,
        product.category,
        product.description,
        product.is_featured ? 1 : 0,
        product.is_active ? 1 : 0
      );
      
      count++;
    }
    
    console.log(`✅ Successfully seeded ${count} products`);
    
    // Show statistics
    const stats = {
      total: db.prepare('SELECT COUNT(*) as count FROM products').get().count,
      featured: db.prepare('SELECT COUNT(*) as count FROM products WHERE is_featured = 1').get().count,
      active: db.prepare('SELECT COUNT(*) as count FROM products WHERE is_active = 1').get().count,
      by_dimension: {}
    };
    
    const dimensions = ['30x30', '30x90', '40x40', '40x100', '60x60', '60x120', '80x80', '100x100'];
    dimensions.forEach(dim => {
      const count = db.prepare('SELECT COUNT(*) as count FROM products WHERE dimension = ?').get(dim).count;
      if (count > 0) {
        stats.by_dimension[dim] = count;
      }
    });
    
    console.log('\n📊 Database Statistics:');
    console.log(`   Total Products: ${stats.total}`);
    console.log(`   Featured Products: ${stats.featured}`);
    console.log(`   Active Products: ${stats.active}`);
    console.log('\n📐 Products by Dimension:');
    Object.entries(stats.by_dimension).forEach(([dim, count]) => {
      console.log(`   ${dim}: ${count} products`);
    });
    
    console.log('\n✨ Product seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    throw error;
  }
}

// Run seeding
seedProducts();
