const express = require('express');
const router = express.Router();
const { getCategories } = require('../database');

// Get all categories
router.get('/', (req, res) => {
  try {
    const categories = getCategories();
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to get categories' });
  }
});

module.exports = router;
