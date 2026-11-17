const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Get User Profile
app.get('/api/profile', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = 1');
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Update User Profile / Settings
app.put('/api/profile', async (req, res) => {
  const { username, email, bio } = req.body;
  try {
    const result = await pool.query(
      'UPDATE users SET username = $1, email = $2, bio = $3 WHERE id = 1 RETURNING *',
      [username, email, bio]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Get All Connected Accounts
app.get('/api/accounts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM connected_accounts WHERE user_id = 1');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Add Another Social Media Account
app.post('/api/accounts', async (req, res) => {
  const { platform, account_handle } = req.body;
  try {
    const newAccount = await pool.query(
      'INSERT INTO connected_accounts (user_id, platform, account_handle) VALUES (1, $1, $2) RETURNING *',
      [platform, account_handle]
    );
    
    // Simulate fetching initial posts from the newly connected API
    await pool.query(
      'INSERT INTO social_posts (account_id, platform, post_type, author, content) VALUES ($1, $2, $3, $4, $5)',
      [newAccount.rows[0].id, platform, 'feed', `${platform} Official`, `Connected ${account_handle} to your dashboard!`]
    );

    res.json(newAccount.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Get All Posts (For Platform Columns & Combined Feed)
app.get('/api/posts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM social_posts ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));