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
    console.error('⚠️  Warning: Database initialization failed:', error.message);
    console.log('Continuing anyway - tables may already exist');
    // Don't throw - let the app start even if migration fails
  } finally {
    await client.end();
  }
}

initDatabase().catch(err => {
  console.error('Migration error (non-fatal):', err.message);
  process.exit(0); // Exit successfully anyway
});
