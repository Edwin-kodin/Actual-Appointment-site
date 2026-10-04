import { createConnection } from 'mysql2/promise';
import * as dotenv from 'dotenv';
dotenv.config();

async function seedUser() {
  console.log('Connecting to database...');
  const connection = await createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5001,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'admin@225',
    database: process.env.DB_NAME || 'glowgh'
  });

  const mockId = '11111111-1111-1111-1111-111111111111';
  
  try {
    await connection.execute(`
      INSERT IGNORE INTO users (id, email, password, name, role, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    `, [mockId, 'edwin@example.com', 'password123', 'Edwin Allotey', 'customer']);
    
    console.log('Successfully seeded mock user!');
  } catch (err) {
    console.error('Failed to seed user:', err);
  } finally {
    await connection.end();
  }
}

seedUser().catch(console.error);
