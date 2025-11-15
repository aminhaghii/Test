const express = require('express');
const router = express.Router();
const { createBlogPost, updateBlogPost, deleteBlogPost, getBlogPost, getBlogPostBySlug, getAllBlogPosts, getBlogPostsCount } = require('../database');
const { authenticateAdmin, optionalAuth } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// Get all blog posts (public - only published)
router.get('/', async (req, res) => {
  try {
    const { limit = 10, offset = 0, search } = req.query;
    const filters = {
      is_published: 1,
      limit: parseInt(limit),
      offset: parseInt(offset)
    };
    if (search) filters.search = search;

    const posts = getAllBlogPosts(filters);
    const total = getBlogPostsCount(filters);

    res.json({
      posts,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

// Get all blog posts (admin - all posts)
router.get('/admin', authenticateAdmin, async (req, res) => {
  try {
    const { limit = 50, offset = 0, search, is_published } = req.query;
    const filters = {
      limit: parseInt(limit),
      offset: parseInt(offset)
    };
    if (search) filters.search = search;
    if (is_published !== undefined) filters.is_published = is_published === 'true' || is_published === '1';

    const posts = getAllBlogPosts(filters);
    const total = getBlogPostsCount(filters);

    res.json({
      posts,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

// Get single blog post by slug (public)
router.get('/:slug', optionalAuth, async (req, res) => {
  try {
    const post = getBlogPostBySlug(req.params.slug);
    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    if (!post.is_published && req.user?.role !== 'admin') {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

// Get single blog post by ID (admin)
router.get('/admin/:id', authenticateAdmin, async (req, res) => {
  try {
    const post = getBlogPost(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

// Create blog post (admin only)
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const { title, slug, excerpt, content, image_url, is_published, published_at } = req.body;
    
    if (!title || !slug || !content) {
      return res.status(400).json({ error: 'Title, slug, and content are required' });
    }

    const post = {
      id: uuidv4(),
      title,
      slug,
      excerpt: excerpt || '',
      content,
      image_url: image_url || null,
      author_id: req.user.id,
      is_published: is_published || false,
      published_at: published_at || (is_published ? new Date().toISOString() : null)
    };

    const createdPost = createBlogPost(post);
    res.status(201).json(createdPost);
  } catch (error) {
    console.error('Error creating blog post:', error);
    if (error.message?.includes('UNIQUE constraint')) {
      return res.status(400).json({ error: 'Slug already exists' });
    }
    res.status(500).json({ error: 'Failed to create blog post' });
  }
});

// Update blog post (admin only)
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { title, slug, excerpt, content, image_url, is_published, published_at } = req.body;
    
    const existingPost = getBlogPost(req.params.id);
    if (!existingPost) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    const updateData = {
      title: title || existingPost.title,
      slug: slug || existingPost.slug,
      excerpt: excerpt !== undefined ? excerpt : existingPost.excerpt,
      content: content || existingPost.content,
      image_url: image_url !== undefined ? image_url : existingPost.image_url,
      is_published: is_published !== undefined ? is_published : existingPost.is_published,
      published_at: published_at !== undefined ? published_at : existingPost.published_at
    };

    const updatedPost = updateBlogPost(req.params.id, updateData);
    res.json(updatedPost);
  } catch (error) {
    console.error('Error updating blog post:', error);
    if (error.message?.includes('UNIQUE constraint')) {
      return res.status(400).json({ error: 'Slug already exists' });
    }
    res.status(500).json({ error: 'Failed to update blog post' });
  }
});

// Delete blog post (admin only)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const post = getBlogPost(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    deleteBlogPost(req.params.id);
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ error: 'Failed to delete blog post' });
  }
});

module.exports = router;

