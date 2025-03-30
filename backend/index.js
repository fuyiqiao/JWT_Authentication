const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const secretKey = 'bfdedb53c7a409906362b406218260e951c2dbdd89bd4c400d6e60ad349987f6bab117824dd9a09b8c0a6e0f01a786ae1c3b2a329f6235b792a97583444d13f8c6f426c31e189ac206abdcedbc50938d7bb5a6162c69e7da9d68d0895cd0cd864ca681ceb09c64f81fe4e09ce8537d792671777136f450c97e8223b16c3a6f6d5181fa9e42f047b956653990d2e225d9b794f5133b4a435238d6da74dde5f1f7e1e23e7f2d16b68a88e96726aa80917f7c28210c2a175ae393eae851951bfb6d7cfece2e0c60677c2fbb15e105bc0261a5a8dbf947340701ec298ff52dbc229deefb78c878e22972e6301945f36bf7fccca60eaf785c589e493017f13cf2f18e';

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

// Routes
app.post('/login', (req, res) => {
  // Simulating user authentication
  const { username, password } = req.body;

  // You can implement your own user authentication logic here
  if (username === 'admin' && password === 'admin123') {
    // User is authenticated
    const token = jwt.sign({ username }, secretKey);
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Protected data' });
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
app.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});
