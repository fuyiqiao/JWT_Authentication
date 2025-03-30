# JWT_Authentication

## Features

- User registration with personal details
- JWT-based authentication
- Protected routes and data
- User dashboard with personal information
- PostgreSQL database integration

## Setup Instructions

> Reminder to edit the JWT secret token during production!

### 1. Database Setup
- Login to the local database 
- Create new users table

```bash
# Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nric VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  dob DATE NOT NULL,
  address TEXT NOT NULL,
  gender VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Clone repository
```bash
git clone git@github.com:fuyiqiao/JWT_Authentication.git
```

### 3. Run Backend
```bash
cd backend

# Install dependencies
npm install

# Create .env file
echo "JWT_SECRET_KEY=your_secure_secret_here
PG_USER=your_db_user
PG_PASSWORD=your_db_password
PG_HOST=localhost
PG_PORT=5432
PG_DB=postgres
PORT=3001" > .env

# Start server
node index.js
```

### 4. Run Frontend

``` bash
cd frontend

# Install dependencies
npm install

# Start application
npm start
```