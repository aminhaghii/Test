const Database = require('better-sqlite3');
const path = require('path');

// Database path - use absolute path to ensure consistency
// Always use the database.db in the backend directory
// Find the backend directory by checking if we're in a subdirectory
const backendDir = __dirname.includes('routes') || __dirname.includes('middleware') 
  ? path.join(__dirname, '..')
  : __dirname;
const dbPath = process.env.DATABASE_PATH || path.resolve(backendDir, 'database.db');
console.log('🗄️  Database path:', dbPath);
console.log('📁 __dirname:', __dirname);
console.log('📂 backendDir:', backendDir);
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
function initDatabase() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT,
      name TEXT,
      avatar_url TEXT,
      role TEXT DEFAULT 'user' CHECK(role IN ('admin', 'user')),
      google_id TEXT UNIQUE,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME,
      -- Enhanced profile fields
      user_type TEXT CHECK(user_type IN ('personal', 'company')),
      company_name TEXT,
      employee_count TEXT,
      industry TEXT,
      primary_use_case TEXT,
      phone TEXT,
      website TEXT,
      country TEXT,
      city TEXT,
      address TEXT,
      preferred_tile_types TEXT,
      budget_range TEXT,
      project_timeline TEXT,
      how_heard_about_us TEXT,
      additional_notes TEXT,
      profile_completion_percentage INTEGER DEFAULT 0,
      profile_updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Add new columns to existing users table if they don't exist
  try {
    const columns = [
      'user_type', 'company_name', 'employee_count', 'industry', 'primary_use_case',
      'phone', 'website', 'country', 'city', 'address', 'preferred_tile_types',
      'budget_range', 'project_timeline', 'how_heard_about_us', 'additional_notes',
      'profile_completion_percentage', 'profile_updated_at'
    ];
    
    columns.forEach(column => {
      try {
        if (column === 'profile_completion_percentage') {
          db.prepare(`ALTER TABLE users ADD COLUMN ${column} INTEGER DEFAULT 0`).run();
        } else if (column === 'profile_updated_at') {
          db.prepare(`ALTER TABLE users ADD COLUMN ${column} DATETIME DEFAULT CURRENT_TIMESTAMP`).run();
        } else {
          db.prepare(`ALTER TABLE users ADD COLUMN ${column} TEXT`).run();
        }
      } catch (err) {
        // Column already exists, ignore error
      }
    });
  } catch (error) {
    console.log('Migration completed or columns already exist');
  }

  // Categories table
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      icon TEXT,
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Products table
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      dimension TEXT NOT NULL,
      surface TEXT NOT NULL,
      body_type TEXT NOT NULL,
      color TEXT,
      category TEXT,
      price REAL,
      stock_quantity INTEGER DEFAULT 0,
      image_url TEXT,
      additional_images TEXT,
      texture_images TEXT,
      features TEXT,
      packaging TEXT,
      description TEXT,
      technical_specs TEXT,
      is_featured INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_by TEXT,
      updated_by TEXT,
      FOREIGN KEY (created_by) REFERENCES users(id),
      FOREIGN KEY (updated_by) REFERENCES users(id)
    )
  `);

  // Add new columns to existing products table if they don't exist
  try {
    db.exec(`ALTER TABLE products ADD COLUMN texture_images TEXT`);
  } catch (e) {
    // Column already exists
  }
  
  try {
    db.exec(`ALTER TABLE products ADD COLUMN features TEXT`);
  } catch (e) {
    // Column already exists
  }
  
  try {
    db.exec(`ALTER TABLE products ADD COLUMN packaging TEXT`);
  } catch (e) {
    // Column already exists
  }
  
  try {
    db.exec(`ALTER TABLE products ADD COLUMN decor_image_url TEXT`);
  } catch (e) {
    // Column already exists
  }
  
  try {
    db.exec(`ALTER TABLE products ADD COLUMN thickness REAL`);
  } catch (e) {
    // Column already exists
  }
  
  try {
    db.exec(`ALTER TABLE products ADD COLUMN absorption_rate TEXT`);
  } catch (e) {
    // Column already exists
  }

  // Product images table
  db.exec(`
    CREATE TABLE IF NOT EXISTS product_images (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      image_url TEXT NOT NULL,
      is_primary INTEGER DEFAULT 0,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `);

  // Orders table
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      order_number TEXT UNIQUE NOT NULL,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
      total_amount REAL,
      shipping_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Order items table
  db.exec(`
    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      product_id TEXT,
      quantity INTEGER NOT NULL,
      unit_price REAL,
      total_price REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);

  // Create indexes
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_products_dimension ON products(dimension);
    CREATE INDEX IF NOT EXISTS idx_products_surface ON products(surface);
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
    CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
    CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
    CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
  `);

  // Insert default categories
  const categoriesExist = db.prepare('SELECT COUNT(*) as count FROM categories').get();
  if (categoriesExist.count === 0) {
    const insertCategory = db.prepare(`
      INSERT INTO categories (id, name, slug, description, icon, sort_order)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const categories = [
      ['cat-1', 'Floor tiles', 'floor-tiles', 'Premium flooring solutions', 'Grid3X3', 1],
      ['cat-2', 'Wall tiles', 'wall-tiles', 'Elegant wall coverings', 'Home', 2],
      ['cat-3', 'Kitchens', 'kitchens', 'Kitchen design solutions', 'ChefHat', 3],
      ['cat-4', 'Bathroom', 'bathroom', 'Luxury bathroom designs', 'Bath', 4],
      ['cat-5', 'Other interiors', 'other-interiors', 'Complete interior solutions', 'Sofa', 5]
    ];

    const insertMany = db.transaction((cats) => {
      for (const cat of cats) {
        insertCategory.run(...cat);
      }
    });

    insertMany(categories);
    console.log('✅ Default categories inserted');
  }

  // Create default admin user
  const adminExists = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?').get('admin');
  if (adminExists.count === 0) {
    const bcrypt = require('bcrypt');
    const hashedPassword = bcrypt.hashSync('admin123456', 10);
    
    db.prepare(`
      INSERT INTO users (id, email, password, name, role, created_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).run(
      'admin-default',
      'admin@almasceram.com',
      hashedPassword,
      'Admin',
      'admin'
    );

    console.log('✅ Default admin created:');
    console.log('   Email: admin@almasceram.com');
    console.log('   Password: admin123456');
  }

  console.log('✅ Database initialized successfully');
}

// Helper functions
const dbHelpers = {
  // Get all products with filters
  getProducts: (filters = {}, pagination = {}) => {
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (filters.dimensions && filters.dimensions.length > 0) {
      query += ` AND dimension IN (${filters.dimensions.map(() => '?').join(',')})`;
      params.push(...filters.dimensions);
    }

    if (filters.surfaces && filters.surfaces.length > 0) {
      query += ` AND surface IN (${filters.surfaces.map(() => '?').join(',')})`;
      params.push(...filters.surfaces);
    }

    if (filters.bodyTypes && filters.bodyTypes.length > 0) {
      query += ` AND body_type IN (${filters.bodyTypes.map(() => '?').join(',')})`;
      params.push(...filters.bodyTypes);
    }

    if (filters.categories && filters.categories.length > 0) {
      query += ` AND category IN (${filters.categories.map(() => '?').join(',')})`;
      params.push(...filters.categories);
    }

    if (filters.searchTerm) {
      query += ' AND name LIKE ?';
      params.push(`%${filters.searchTerm}%`);
    }

    if (filters.isActive !== undefined) {
      query += ' AND is_active = ?';
      params.push(filters.isActive ? 1 : 0);
    }

    if (filters.isFeatured !== undefined) {
      query += ' AND is_featured = ?';
      params.push(filters.isFeatured ? 1 : 0);
    }

    // Count total
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
    const { total } = db.prepare(countQuery).get(...params);

    // Add pagination
    query += ' ORDER BY created_at DESC';
    if (pagination.page && pagination.pageSize) {
      const offset = (pagination.page - 1) * pagination.pageSize;
      query += ' LIMIT ? OFFSET ?';
      params.push(pagination.pageSize, offset);
    }

    const products = db.prepare(query).all(...params);

    // Parse JSON fields
    products.forEach(p => {
      const jsonFields = ['additional_images', 'texture_images', 'features', 'packaging', 'technical_specs'];
      jsonFields.forEach(field => {
        if (p[field]) {
          try {
            p[field] = JSON.parse(p[field]);
          } catch (e) {
            p[field] = field === 'technical_specs' ? {} : [];
          }
        } else {
          p[field] = field === 'technical_specs' ? {} : [];
        }
      });
      
      p.is_active = Boolean(p.is_active);
      p.is_featured = Boolean(p.is_featured);
    });

    return {
      products,
      total,
      page: pagination.page || 1,
      pageSize: pagination.pageSize || products.length,
      totalPages: pagination.pageSize ? Math.ceil(total / pagination.pageSize) : 1
    };
  },

  // Get single product
  getProductById: (id) => {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (product) {
      // Parse JSON fields
      const jsonFields = ['additional_images', 'texture_images', 'features', 'packaging', 'technical_specs'];
      jsonFields.forEach(field => {
        if (product[field]) {
          try {
            product[field] = JSON.parse(product[field]);
          } catch (e) {
            product[field] = Array.isArray(product[field]) ? [] : {};
          }
        } else {
          product[field] = field === 'technical_specs' ? {} : [];
        }
      });
      
      product.is_active = Boolean(product.is_active);
      product.is_featured = Boolean(product.is_featured);
    }
    return product;
  },

  // Create product
  createProduct: (product) => {
    const id = `prod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const stmt = db.prepare(`
      INSERT INTO products (
        id, name, slug, dimension, surface, body_type, color, category,
        price, stock_quantity, image_url, additional_images, texture_images,
        features, packaging, description, technical_specs, is_featured, is_active, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      product.name,
      product.slug,
      product.dimension,
      product.surface,
      product.body_type,
      product.color || null,
      product.category || null,
      product.price || null,
      product.stock_quantity || 0,
      product.image_url || null,
      product.additional_images ? JSON.stringify(product.additional_images) : null,
      product.texture_images ? JSON.stringify(product.texture_images) : null,
      product.features ? JSON.stringify(product.features) : null,
      product.packaging ? JSON.stringify(product.packaging) : null,
      product.description || null,
      product.technical_specs ? JSON.stringify(product.technical_specs) : null,
      product.is_featured ? 1 : 0,
      product.is_active ? 1 : 0,
      product.created_by || null
    );

    return dbHelpers.getProductById(id);
  },

  // Update product
  updateProduct: (id, updates) => {
    try {
      const fields = [];
      const params = [];

      // Skip system fields that shouldn't be updated directly
      const skipFields = ['id', 'created_at', 'created_by'];
      
      // JSON fields that need to be stringified
      const jsonFields = ['additional_images', 'texture_images', 'features', 'packaging', 'technical_specs'];
      
      Object.keys(updates).forEach(key => {
        if (skipFields.includes(key)) return;
        
        if (jsonFields.includes(key)) {
          fields.push(`${key} = ?`);
          params.push(updates[key] ? JSON.stringify(updates[key]) : null);
        } else if (key === 'is_featured' || key === 'is_active') {
          fields.push(`${key} = ?`);
          params.push(updates[key] ? 1 : 0);
        } else if (updates[key] !== undefined && updates[key] !== null) {
          fields.push(`${key} = ?`);
          params.push(updates[key]);
        }
      });

      if (fields.length === 0) {
        throw new Error('No valid fields to update');
      }

      fields.push('updated_at = CURRENT_TIMESTAMP');
      params.push(id);

      const query = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;
      const result = db.prepare(query).run(...params);
      
      if (result.changes === 0) {
        throw new Error(`Product with id ${id} not found`);
      }

      return dbHelpers.getProductById(id);
    } catch (error) {
      console.error('Update product error:', error);
      throw error;
    }
  },

  // Delete product
  deleteProduct: (id) => {
    db.prepare('DELETE FROM products WHERE id = ?').run(id);
    return true;
  },

  // Bulk delete
  bulkDeleteProducts: (ids) => {
    const placeholders = ids.map(() => '?').join(',');
    db.prepare(`DELETE FROM products WHERE id IN (${placeholders})`).run(...ids);
    return true;
  },

  // Get user by email
  getUserByEmail: (email) => {
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  },

  // Get user by Google ID
  getUserByGoogleId: (googleId) => {
    return db.prepare('SELECT * FROM users WHERE google_id = ?').get(googleId);
  },

  // Create or update user
  upsertUser: (user) => {
    const existing = user.google_id 
      ? dbHelpers.getUserByGoogleId(user.google_id)
      : dbHelpers.getUserByEmail(user.email);

    if (existing) {
      db.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(existing.id);
      return existing;
    }

    const id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    db.prepare(`
      INSERT INTO users (id, email, name, avatar_url, google_id, role, last_login)
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).run(
      id,
      user.email,
      user.name || null,
      user.avatar_url || null,
      user.google_id || null,
      user.role || 'user'
    );

    return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  },

  // Get all categories
  getCategories: () => {
    return db.prepare('SELECT * FROM categories WHERE is_active = 1 ORDER BY sort_order').all();
  },

  // Enhanced user management functions
  updateUserProfile: (userId, profileData) => {
    try {
      const fields = [];
      const params = [];
      
      // Calculate profile completion percentage
      const completionFields = [
        'name', 'user_type', 'company_name', 'industry', 'phone', 
        'country', 'city', 'preferred_tile_types', 'budget_range'
      ];
      
      let completedFields = 0;
      completionFields.forEach(field => {
        if (profileData[field] && profileData[field].trim() !== '') {
          completedFields++;
        }
      });
      
      const completionPercentage = Math.round((completedFields / completionFields.length) * 100);
      
      Object.keys(profileData).forEach(key => {
        if (profileData[key] !== undefined && profileData[key] !== null) {
          fields.push(`${key} = ?`);
          params.push(profileData[key]);
        }
      });
      
      if (fields.length === 0) {
        throw new Error('No valid fields to update');
      }
      
      fields.push('profile_completion_percentage = ?');
      params.push(completionPercentage);
      
      fields.push('profile_updated_at = CURRENT_TIMESTAMP');
      params.push(userId);
      
      const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
      const result = db.prepare(query).run(...params);
      
      if (result.changes === 0) {
        throw new Error(`User with id ${userId} not found`);
      }
      
      return dbHelpers.getUserById(userId);
    } catch (error) {
      console.error('Update user profile error:', error);
      throw error;
    }
  },

  getUserById: (userId) => {
    return db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  },

  getAllUsers: (filters = {}) => {
    let query = 'SELECT * FROM users WHERE role = ?';
    const params = ['user'];
    
    if (filters.user_type) {
      query += ' AND user_type = ?';
      params.push(filters.user_type);
    }
    
    if (filters.industry) {
      query += ' AND industry = ?';
      params.push(filters.industry);
    }
    
    if (filters.min_completion) {
      query += ' AND profile_completion_percentage >= ?';
      params.push(filters.min_completion);
    }
    
    if (filters.search) {
      query += ' AND (name LIKE ? OR email LIKE ? OR company_name LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    
    query += ' ORDER BY created_at DESC';
    
    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
    }
    
    if (filters.offset) {
      query += ' OFFSET ?';
      params.push(filters.offset);
    }
    
    try {
      const result = db.prepare(query).all(...params);
      return result;
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      throw error;
    }
  },

  getUsersCount: (filters = {}) => {
    let query = 'SELECT COUNT(*) as count FROM users WHERE role = ?';
    const params = ['user'];
    
    if (filters.user_type) {
      query += ' AND user_type = ?';
      params.push(filters.user_type);
    }
    
    if (filters.industry) {
      query += ' AND industry = ?';
      params.push(filters.industry);
    }
    
    if (filters.min_completion) {
      query += ' AND profile_completion_percentage >= ?';
      params.push(filters.min_completion);
    }
    
    if (filters.search) {
      query += ' AND (name LIKE ? OR email LIKE ? OR company_name LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    
    const result = db.prepare(query).get(...params);
    return result ? result.count : 0;
  }
};

module.exports = {
  db,
  initDatabase,
  ...dbHelpers
};
