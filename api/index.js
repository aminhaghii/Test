// Vercel Serverless Function wrapper for Express backend
// Note: SQLite has limitations in serverless environments
// Consider using a cloud database (Supabase, PlanetScale) for production

const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const fs = require('fs');

// Try to initialize database, but handle errors gracefully
let dbInitialized = false;
try {
  const { initDatabase } = require('../backend/database');
  initDatabase();
  dbInitialized = true;
} catch (error) {
  console.warn('⚠️ Database initialization failed (may be normal in serverless):', error.message);
}

const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Session configuration for serverless
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Serve static assets from public folder
const staticHeaders = (res) => {
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  }
};

// Static file routes - serve from public folder
const publicDir = path.join(__dirname, '..', 'public');
app.use('/ALMAS', express.static(path.join(publicDir, 'ALMAS'), { setHeaders: staticHeaders }));
app.use('/DECORED', express.static(path.join(publicDir, 'DECORED'), { setHeaders: staticHeaders }));
app.use('/Content', express.static(path.join(publicDir, 'Content'), { setHeaders: staticHeaders }));

// Routes - only load if database is initialized
if (dbInitialized) {
  try {
    app.use('/api/auth', require('../backend/routes/auth'));
    app.use('/api/products', require('../backend/routes/products'));
    app.use('/api/upload', require('../backend/routes/upload'));
    app.use('/api/categories', require('../backend/routes/categories'));
    app.use('/api/ai', require('../backend/routes/ai'));
    app.use('/api/blog', require('../backend/routes/blog'));
  } catch (error) {
    console.error('❌ Failed to load routes:', error);
  }
} else {
  // Fallback routes when database is not available
  app.use('/api/products', (req, res) => {
    res.status(503).json({ 
      error: 'Backend service unavailable',
      message: 'Database is not available in serverless environment. Please deploy backend separately or use a cloud database.'
    });
  });
  
  app.use('/api/*', (req, res) => {
    res.status(503).json({ 
      error: 'Backend service unavailable',
      message: 'Backend API is not configured. Please deploy backend separately.'
    });
  });
}

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: dbInitialized ? 'ok' : 'limited',
    message: dbInitialized ? 'Server is running' : 'Server is running but database is not available',
    database: dbInitialized ? 'connected' : 'unavailable'
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Export for Vercel Serverless Functions
module.exports = app;
