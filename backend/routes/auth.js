const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path');
const Database = require('better-sqlite3');
const { OAuth2Client } = require('google-auth-library');

// Initialize database directly in this file
const dbPath = path.join(__dirname, '..', 'database.db');
const db = new Database(dbPath);

// Helper functions
const getUserByEmail = (email) => {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
};

const { upsertUser, getAllUsers, getUsersCount, getUserById, updateUserProfile } = require('../database');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Google OAuth client
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

// Register new user
router.post('/register', async (req, res) => {
  const { 
    email, 
    password, 
    name,
    user_type,
    company_name,
    employee_count,
    industry,
    primary_use_case
  } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    console.log('Register attempt for:', email);
    
    // Check if user already exists
    const existing = getUserByEmail(email);
    if (existing) {
      console.log('User already exists:', email);
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with enhanced profile data
    const id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Calculate initial profile completion
    const completionFields = ['name', 'user_type', 'company_name', 'industry'];
    let completedFields = 0;
    completionFields.forEach(field => {
      if (req.body[field] && req.body[field].trim() !== '') {
        completedFields++;
      }
    });
    const initialCompletion = Math.round((completedFields / completionFields.length) * 100);

    console.log('Creating user with ID:', id);

    db.prepare(`
      INSERT INTO users (
        id, email, password, name, role, last_login,
        user_type, company_name, employee_count, industry, primary_use_case,
        profile_completion_percentage
      )
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      email,
      hashedPassword,
      name || email.split('@')[0],
      'user',
      user_type || null,
      company_name || null,
      employee_count || null,
      industry || null,
      primary_use_case || null,
      initialCompletion
    );

    console.log('User created successfully');

    const user = getUserByEmail(email);

    // Generate JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-jwt-secret',
      { expiresIn: '7d' }
    );

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        profile_completion_percentage: user.profile_completion_percentage
      },
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Verify Cloudflare Turnstile token
async function verifyTurnstile(token, ip) {
  if (!token || !process.env.VITE_TURNSTILE_SECRET_KEY) {
    return true; // Skip verification if no secret key configured
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: process.env.VITE_TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: ip
      })
    });
    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return false;
  }
}

// Login
router.post('/login', async (req, res) => {
  const { email, password, turnstileToken } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Verify Cloudflare Turnstile if provided
    const secretKey = process.env.VITE_TURNSTILE_SECRET_KEY;
    if (secretKey) {
      const isValidTurnstile = await verifyTurnstile(turnstileToken, req.ip);
      if (!isValidTurnstile) {
        return res.status(403).json({ error: 'Security verification failed. Please try again.' });
      }
    }

    const user = getUserByEmail(email);
    
    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update last login
    db.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(user.id);

    // Generate JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-jwt-secret',
      { expiresIn: '7d' }
    );

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar_url: user.avatar_url
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Google login with ID token (Google Identity Services)
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body; // Google ID token
    if (!credential) {
      return res.status(400).json({ error: 'Missing Google credential' });
    }
    if (!googleClient) {
      return res.status(500).json({ error: 'Google client not configured' });
    }

    // Verify token with Google
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(401).json({ error: 'Invalid Google token' });
    }

    const email = payload.email;
    const googleId = payload.sub;
    const name = payload.name || (email ? email.split('@')[0] : 'User');
    const avatarUrl = payload.picture || null;

    if (!email || !googleId) {
      return res.status(400).json({ error: 'Google token missing required fields' });
    }

    // Find existing user by google_id or email
    let user = db.prepare('SELECT * FROM users WHERE google_id = ?').get(googleId);
    if (!user) {
      user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    }

    if (user) {
      // Link google_id if not set; update avatar/name softly
      if (!user.google_id) {
        db.prepare('UPDATE users SET google_id = ?, avatar_url = COALESCE(?, avatar_url), name = COALESCE(?, name), last_login = CURRENT_TIMESTAMP WHERE id = ?')
          .run(googleId, avatarUrl, name, user.id);
      } else {
        db.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(user.id);
      }
      user = db.prepare('SELECT * FROM users WHERE id = ?').get(user.id);
    } else {
      // Create new user
      const id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      db.prepare(`
        INSERT INTO users (
          id, email, password, name, role, last_login,
          google_id, avatar_url, is_active
        ) VALUES (?, ?, NULL, ?, 'user', CURRENT_TIMESTAMP, ?, ?, 1)
      `).run(id, email, name, googleId, avatarUrl);
      user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    }

    // Issue our JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-jwt-secret',
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar_url: user.avatar_url,
      },
      token,
    });
  } catch (error) {
    console.error('Google login error:', error);
    return res.status(500).json({ error: 'Google login failed' });
  }
});

// Get current user
router.get('/me', verifyToken, (req, res) => {
  try {
    const user = getUserByEmail(req.user.email);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar_url: user.avatar_url,
      is_active: Boolean(user.is_active)
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

// Make user admin (development only)
router.post('/make-admin', verifyToken, (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ error: 'Not available in production' });
  }

  const { db } = require('../database');
  db.prepare('UPDATE users SET role = ? WHERE id = ?').run('admin', req.user.id);

  res.json({ message: 'User is now admin' });
});

// Get user profile
router.get('/profile', verifyToken, (req, res) => {
  try {
    const user = getUserById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove sensitive data
    const { password, ...userProfile } = user;
    res.json(userProfile);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Update user profile
router.put('/profile', verifyToken, (req, res) => {
  try {
    const updatedUser = updateUserProfile(req.user.id, req.body);
    
    // Remove sensitive data
    const { password, ...userProfile } = updatedUser;
    res.json(userProfile);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Admin routes for user management
router.get('/admin/users', verifyToken, isAdmin, (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    // Get real users from database
    const allUsers = db.prepare('SELECT * FROM users WHERE role = ? ORDER BY created_at DESC').all('user');
    
    // Apply pagination manually
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedUsers = allUsers.slice(startIndex, endIndex);
    
    res.json({
      users: paginatedUsers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: allUsers.length,
        pages: Math.ceil(allUsers.length / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Get specific user details (admin only)
router.get('/admin/users/:id', verifyToken, isAdmin, (req, res) => {
  try {
    const user = getUserById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Remove sensitive data
    const { password, ...userProfile } = user;
    res.json(userProfile);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Update user details (admin only)
router.put('/admin/users/:id', verifyToken, isAdmin, (req, res) => {
  try {
    const updatedUser = updateUserProfile(req.params.id, req.body);
    
    // Remove sensitive data
    const { password, ...userProfile } = updatedUser;
    res.json(userProfile);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

module.exports = router;
