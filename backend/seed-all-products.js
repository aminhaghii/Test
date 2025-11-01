const Database = require('better-sqlite3');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Initialize database
const dbPath = path.join(__dirname, 'database.db');
const db = new Database(dbPath);

// All products based on ALMAS folder structure
const productNames = {
  'Matt': [
    'ANAK LIGHT GRAY', 'DANTEH LIGHT GRAY', 'LOMAN LIGHT GRAY', 'MELINA DARK GRAY', 
    'MISHEL LIGHT GRAY', 'NANCI LIGHT GRAY', 'NATALI DARK GRAY', 'NATALI LIGHT GRAY', 
    'ATEN DARK GRAY', 'HELIA', 'JENOA LIGHT GRAY', 'KAIN DARK GRAY', 'KAIN LIGHT GRAY', 
    'LAMBER WHITE', 'SELENA WHITE', 'SIENA LIGHT GRAY'
  ],
  'Trans': [
    'AGRA LIGHT GRAY', 'BIANCO WHITE', 'DAIANA DARK GRAY', 'DAIANA LIGHT GRAY', 
    'DIYACO CREAM LIGHT', 'ERIK CREAM LIGHT', 'FIGARO LIGHT CREAM', 'GELORIYA LIGHT CREAM', 
    'HELENA LIGHT GRAY', 'JULIA WHITE', 'KAROL LIGHT GRAY', 'KATRIN LIGHT GRAY', 
    'PARMA WHITE', 'PIZARO WHITE', 'VILAS LIGHT CREAMY'
  ],
  'Polished': [
    'HELMA', 'KADIA', 'KAYAN', 'LEGRO', 'MAGNOLIA', 'MARTA', 'PEDRO', 'SALTIS', 
    'SAVANA', 'TORENTO', 'VALENCIA', 'VALERIA'
  ]
};

const dimensions = ['30x30', '30x90', '40x40', '40x100', '60x60', '60x120', '80x80', '100x100'];
const surfaces = ['Matt', 'Trans', 'Polished'];

function generateSlug(name, dimension, surface) {
  return `${name}-${dimension}-${surface}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function seedAllProducts() {
  console.log('🌱 Starting ALL products seeding...');
  
  try {
    // Clear existing products
    db.prepare('DELETE FROM products').run();
    console.log('✅ Cleared existing products');
    
    const insertStmt = db.prepare(`
      INSERT INTO products (
        id, name, slug, dimension, surface, body_type, color, category,
        description, is_featured, is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);
    
    let count = 0;
    let featured = 0;
    
    dimensions.forEach(dimension => {
      surfaces.forEach(surface => {
        const names = productNames[surface] || [];
        names.forEach((name, index) => {
          const id = uuidv4();
          const slug = generateSlug(name, dimension, surface);
          
          // Determine color from name
          const color = name.includes('WHITE') ? 'White' : 
                       name.includes('LIGHT') ? 'Light Gray' :
                       name.includes('DARK') ? 'Dark Gray' :
                       name.includes('CREAM') ? 'Cream' : 'Natural';
          
          // Determine body type
          const bodyType = color === 'White' ? 'Ceramic' : 'Porcelain';
          
          // Determine category
          const category = parseInt(dimension.split('x')[0]) >= 60 ? 'Floor Tiles' : 'Wall Tiles';
          
          // Make some products featured (first 2 of each surface/dimension combo)
          const isFeatured = index < 2;
          if (isFeatured) featured++;
          
          const description = `Premium ${surface} ${bodyType} tile in ${color} color. Size: ${dimension}cm. Perfect for ${category.toLowerCase()}.`;
          
          insertStmt.run(
            id,
            name,
            slug,
            dimension,
            surface,
            bodyType,
            color,
            category,
            description,
            isFeatured ? 1 : 0,
            1 // is_active
          );
          
          count++;
        });
      });
    });
    
    console.log(`✅ Successfully seeded ${count} products`);
    console.log(`✨ Featured products: ${featured}`);
    
    // Show statistics
    const stats = {
      total: db.prepare('SELECT COUNT(*) as count FROM products').get().count,
      featured: db.prepare('SELECT COUNT(*) as count FROM products WHERE is_featured = 1').get().count,
      active: db.prepare('SELECT COUNT(*) as count FROM products WHERE is_active = 1').get().count,
      by_dimension: {},
      by_surface: {}
    };
    
    dimensions.forEach(dim => {
      const count = db.prepare('SELECT COUNT(*) as count FROM products WHERE dimension = ?').get(dim).count;
      if (count > 0) {
        stats.by_dimension[dim] = count;
      }
    });
    
    surfaces.forEach(surface => {
      const count = db.prepare('SELECT COUNT(*) as count FROM products WHERE surface = ?').get(surface).count;
      if (count > 0) {
        stats.by_surface[surface] = count;
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
    console.log('\n🎨 Products by Surface:');
    Object.entries(stats.by_surface).forEach(([surface, count]) => {
      console.log(`   ${surface}: ${count} products`);
    });
    
    console.log('\n✨ ALL products seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    throw error;
  }
}

// Run seeding
seedAllProducts();

