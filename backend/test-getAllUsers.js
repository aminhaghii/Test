const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'database.db');
const db = new Database(dbPath);

// Test getAllUsers function
function getAllUsers(filters = {}) {
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
  
  if (filters.limit) {
    query += ' LIMIT ?';
    params.push(filters.limit);
  }
  
  if (filters.offset) {
    query += ' OFFSET ?';
    params.push(filters.offset);
  }
  
  console.log('Query:', query);
  console.log('Params:', params);
  
  try {
    const users = db.prepare(query).all(...params);
    console.log('Users found:', users.length);
    return users;
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    throw error;
  }
}

// Test the function
try {
  const users = getAllUsers({});
  console.log('All users:', users);
} catch (error) {
  console.error('Test failed:', error);
}

db.close();
