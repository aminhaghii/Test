const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  bulkDeleteProducts 
} = require('../database');
const { verifyToken, isAdmin, optionalAuth } = require('../middleware/auth');

// Get all products (public with optional filters)
router.get('/', optionalAuth, (req, res) => {
  try {
    const filters = {
      dimensions: req.query.dimensions ? req.query.dimensions.split(',') : [],
      surfaces: req.query.surfaces ? req.query.surfaces.split(',') : [],
      bodyTypes: req.query.bodyTypes ? req.query.bodyTypes.split(',') : [],
      categories: req.query.categories ? req.query.categories.split(',') : [],
      searchTerm: req.query.search || '',
      isActive: req.user?.role === 'admin' ? undefined : true, // Public only sees active
      isFeatured: req.query.featured === 'true' ? true : undefined
    };

    const pagination = {
      page: parseInt(req.query.page) || 1,
      pageSize: parseInt(req.query.pageSize) || 20
    };

    console.log('🔍 Products route called with filters:', JSON.stringify(filters, null, 2));
    console.log('📄 Pagination:', JSON.stringify(pagination, null, 2));
    
    const result = getProducts(filters, pagination);
    
    console.log('✅ Products result:', {
      productsCount: result.products?.length || 0,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages
    });
    
    res.json(result);
  } catch (error) {
    console.error('❌ Get products error:', error);
    res.status(500).json({ error: 'Failed to get products' });
  }
});

// Get single product
router.get('/:id', (req, res) => {
  try {
    const product = getProductById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to get product' });
  }
});

// Create product (admin only)
router.post('/', verifyToken, isAdmin, (req, res) => {
  try {
    const product = createProduct({
      ...req.body,
      created_by: req.user.id
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product (admin only)
router.put('/:id', verifyToken, isAdmin, (req, res) => {
  try {
    console.log('Updating product:', req.params.id, 'with data:', req.body);
    
    const product = updateProduct(req.params.id, {
      ...req.body,
      updated_by: req.user.id
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ 
      error: 'Failed to update product',
      details: error.message 
    });
  }
});

// Delete product (admin only)
router.delete('/:id', verifyToken, isAdmin, (req, res) => {
  try {
    deleteProduct(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Bulk delete (admin only)
router.post('/bulk-delete', verifyToken, isAdmin, (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ error: 'Invalid ids array' });
    }

    bulkDeleteProducts(ids);
    res.json({ message: `${ids.length} products deleted successfully` });
  } catch (error) {
    console.error('Bulk delete error:', error);
    res.status(500).json({ error: 'Failed to delete products' });
  }
});

// Get filter options
router.get('/meta/filters', (req, res) => {
  try {
    const { db } = require('../database');
    
    const dimensions = db.prepare('SELECT DISTINCT dimension FROM products WHERE is_active = 1').all().map(r => r.dimension);
    const surfaces = db.prepare('SELECT DISTINCT surface FROM products WHERE is_active = 1').all().map(r => r.surface);
    const bodyTypes = db.prepare('SELECT DISTINCT body_type FROM products WHERE is_active = 1').all().map(r => r.body_type);
    const categories = db.prepare('SELECT DISTINCT category FROM products WHERE is_active = 1 AND category IS NOT NULL').all().map(r => r.category);

    res.json({
      dimensions,
      surfaces,
      bodyTypes,
      categories
    });
  } catch (error) {
    console.error('Get filters error:', error);
    res.status(500).json({ error: 'Failed to get filters' });
  }
});

module.exports = router;
