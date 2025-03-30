const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const { Client } = require('pg');

const app = express();

dotenv.config();

let secretKey = process.env.JWT_SECRET_KEY;


// Connect to postgres database
const client = new Client({
	user: process.env.PG_USER,
	password: process.env.PG_PASSWORD,
	host: process.env.PG_HOST,
	port: process.env.PG_PORT,
	database: process.env.PG_DB,
});

client
	.connect()
	.then(() => {
		console.log('Connected to PostgreSQL database');
	})
	.catch((err) => {
		console.error('Error connecting to PostgreSQL database', err);
	});

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

// Login
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Get user from database
    const result = await client.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Include user ID in JWT payload
    const token = jwt.sign(
      { userId: user.id },  // Changed from username to userId
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.json({ token });
    
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add this endpoint to get user data
app.get('/user', authenticateToken, async (req, res) => {
  try {
    const result = await client.query(
      'SELECT id, username, nric, first_name, last_name, dob, address, gender FROM users WHERE id = $1',
      [req.user.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('User data error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Creating new user
app.post('/newuser', async (req, res) => {
  try {
    const { 
      username, password, nric, firstName, lastName, dob, address, gender 
    } = req.body;

    // Validate required fields
    const requiredFields = [
      'username', 'password', 'nric', 'firstName', 'lastName', 'dob', 'address', 'gender'
    ];
    
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }

    // Check if username already exists
    const userCheck = await client.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    if (userCheck.rows.length > 0) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const result = await client.query(
      `INSERT INTO users 
      (username, password_hash, nric, first_name, last_name, dob, address, gender)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, username, first_name, last_name`,
      [
        username, hashedPassword, nric, firstName, lastName, dob, address, gender
      ]
    );

    res.status(201).json({
      message: 'User created successfully',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.user = user;
    next();
  });
}

// Start the server
let port = process.env.PORT;
app.listen(port, () => {
  console.log('Server is running on http://localhost:3001');
});
