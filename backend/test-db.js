const Database = require('better-sqlite3');
const path = require('path');

console.log('Current directory:', process.cwd());
console.log('__dirname:', __dirname);

const dbPath = path.join(__dirname, 'database.db');
console.log('Database path:', dbPath);

try {
  const db = new Database(dbPath);
  console.log('Database opened successfully');
  
  // Check if users table exists
  const tableInfo = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'").get();
  console.log('Users table exists:', !!tableInfo);
  
  if (tableInfo) {
    const users = db.prepare('SELECT id, email, role FROM users').all();
    console.log('All users:', users);
    
    const adminUsers = db.prepare('SELECT id, email, role FROM users WHERE role = ?').all('admin');
    console.log('Admin users:', adminUsers);
  }
  
  db.close();
} catch (error) {
  console.error('Database error:', error.message);
}
