const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function initDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('Connecting to database...');
    await client.connect();

    console.log('Reading SQL migration file...');
    const sqlPath = path.join(__dirname, 'create-tables.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Running migrations...');
    await client.query(sql);

    console.log('✅ Database initialized successfully!');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  } finally {
    await client.end();
  }
}

initDatabase();
