const Database = require('better-sqlite3');
const path = require('path');

// Check both possible database locations
const dbPath1 = path.join(__dirname, 'database.db');
const dbPath2 = path.join(__dirname, 'backend', 'data', 'database.db');

console.log('Checking database at:', dbPath1);
try {
  const db1 = new Database(dbPath1);
  const users1 = db1.prepare('SELECT id, email, role FROM users').all();
  console.log('Users in db1:', users1);
  db1.close();
} catch (e) {
  console.log('Error with db1:', e.message);
}

console.log('\nChecking database at:', dbPath2);
try {
  const db2 = new Database(dbPath2);
  const users2 = db2.prepare('SELECT id, email, role FROM users').all();
  console.log('Users in db2:', users2);
  db2.close();
} catch (e) {
  console.log('Error with db2:', e.message);
}
