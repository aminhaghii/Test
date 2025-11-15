require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { initDatabase } = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize database
initDatabase();

// Middleware - Allow all origins in development
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Serve static assets with caching and CORP in production
const staticHeaders = (res) => {
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  }
};

app.use('/uploads', express.static(path.join(__dirname, 'uploads'), { setHeaders: staticHeaders }));
app.use('/ALMAS', express.static(path.join(__dirname, '..', 'ALMAS'), { setHeaders: staticHeaders }));
app.use('/DECORED', express.static(path.join(__dirname, '..', 'DECORED'), { setHeaders: staticHeaders }));
app.use('/Content', express.static(path.join(__dirname, '..', 'Content'), { setHeaders: staticHeaders }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/blog', require('./routes/blog'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║   🚀 Backend Server Running           ║
║   📍 http://localhost:${PORT}          ║
║   🗄️  Database: SQLite (Local)        ║
║   📁 Uploads: ./backend/uploads       ║
╚═══════════════════════════════════════╝
  `);
});

module.exports = app;
