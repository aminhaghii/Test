require('dotenv').config();
const express = require('express');
const cors = require('cors');

console.log('Requiring database...');
const database = require('./database');
console.log('Database required:', Object.keys(database));

const app = express();
const PORT = 3001;

// Initialize database
console.log('Initializing database...');
database.initDatabase();
console.log('Database initialized');

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Test database route
app.get('/test-db', (req, res) => {
  try {
    console.log('Testing database connection...');
    console.log('Available methods:', Object.keys(database));
    const users = database.getAllUsers({});
    console.log('Users found:', users.length);
    res.json({ 
      message: 'Database test successful', 
      userCount: users.length,
      users: users.map(u => ({ id: u.id, email: u.email, role: u.role }))
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ error: 'Database test failed', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});
