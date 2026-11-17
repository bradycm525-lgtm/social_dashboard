const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'social_dashboard',
  password: 'your_postgres_password',
  port: 5432,
});

module.exports = pool;