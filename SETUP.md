# Setup Guide - Library Management System

This guide will walk you through setting up the database and running the application step by step.

## Prerequisites

Before starting, make sure you have:
1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **PostgreSQL** (v12 or higher) - [Download here](https://www.postgresql.org/download/)
3. **npm** (comes with Node.js)

## Step 1: Install Dependencies

Open your terminal/command prompt in the project directory and run:

```bash
npm install
```

This will install all required packages including NestJS, TypeORM, PostgreSQL driver, JWT, etc.

## Step 2: Install and Setup PostgreSQL

### Windows:

1. **Download PostgreSQL:**
   - Go to https://www.postgresql.org/download/windows/
   - Download the installer
   - Run the installer and follow the setup wizard
   - **Remember the password** you set for the `postgres` user (you'll need it later)

2. **Verify Installation:**
   - Open **pgAdmin** (installed with PostgreSQL) or
   - Open **Command Prompt** and run:
     ```bash
     psql --version
     ```

3. **Start PostgreSQL Service:**
   - PostgreSQL service should start automatically
   - If not, go to **Services** (Win + R → services.msc) and start "postgresql-x64-XX" service

### Alternative: Using Docker (Easier)

If you have Docker installed, you can run PostgreSQL in a container:

```bash
docker run --name postgres-library -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=library_management -p 5432:5432 -d postgres
```

## Step 3: Create the Database

### Option A: Using pgAdmin (GUI)

1. Open **pgAdmin**
2. Connect to your PostgreSQL server (use the password you set during installation)
3. Right-click on **Databases** → **Create** → **Database**
4. Name it: `library_management`
5. Click **Save**

### Option B: Using Command Line (psql)

1. Open **Command Prompt** or **PowerShell**
2. Navigate to PostgreSQL bin directory (usually `C:\Program Files\PostgreSQL\XX\bin`)
3. Run:
   ```bash
   psql -U postgres
   ```
4. Enter your PostgreSQL password when prompted
5. Create the database:
   ```sql
   CREATE DATABASE library_management;
   ```
6. Verify it was created:
   ```sql
   \l
   ```
7. Exit psql:
   ```sql
   \q
   ```

### Option C: Using SQL Command (Alternative)

```bash
createdb -U postgres library_management
```

## Step 4: Configure Environment Variables

1. Create a `.env` file in the root directory of your project (same level as `package.json`)

2. Add the following content to `.env`:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password_here
DB_DATABASE=library_management

# JWT Configuration
JWT_SECRET=your-secret-key-change-in-production-12345

# Application
PORT=3000
NODE_ENV=development
```

**Important:** Replace `your_postgres_password_here` with the actual password you set for the PostgreSQL `postgres` user during installation.

## Step 5: Verify Database Connection

The application will automatically connect to the database when it starts. TypeORM will create all the tables automatically (because `synchronize: true` is enabled in development mode).

## Step 6: Run the Application

### Development Mode (with hot reload):

```bash
npm run start:dev
```

### Production Mode:

```bash
# First, build the application
npm run build

# Then, run it
npm run start:prod
```

### Check if it's running:

You should see output like:
```
[Nest] INFO  [NestFactory] Starting Nest application...
[Nest] INFO  [InstanceLoader] AppModule dependencies initialized
[Nest] INFO  [InstanceLoader] TypeOrmModule dependencies initialized
[Nest] INFO  [InstanceLoader] BooksModule dependencies initialized
...
[Nest] INFO  [NestApplication] Nest application successfully started
[Nest] INFO  Application is running on: http://localhost:3000
```

## Step 7: Test the Setup

### 1. Create the First Librarian

Open a new terminal and run:

```bash
curl -X POST http://localhost:3000/librarians/setup -H "Content-Type: application/json" -d "{\"email\":\"admin@library.com\",\"password\":\"admin123\",\"name\":\"Admin Librarian\"}"
```

**Or using PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/librarians/setup" -Method Post -ContentType "application/json" -Body '{"email":"admin@library.com","password":"admin123","name":"Admin Librarian"}'
```

**Or using a tool like Postman:**
- Method: POST
- URL: `http://localhost:3000/librarians/setup`
- Headers: `Content-Type: application/json`
- Body (JSON):
  ```json
  {
    "email": "admin@library.com",
    "password": "admin123",
    "name": "Admin Librarian"
  }
  ```

### 2. Login as Librarian

```bash
curl -X POST http://localhost:3000/auth/login/librarian -H "Content-Type: application/json" -d "{\"email\":\"admin@library.com\",\"password\":\"admin123\"}"
```

You should receive a JWT token in the response.

## Troubleshooting

### Database Connection Issues

**Error: "connect ECONNREFUSED 127.0.0.1:5432"**
- PostgreSQL service is not running
- Solution: Start PostgreSQL service from Services (Win + R → services.msc)

**Error: "password authentication failed"**
- Wrong password in `.env` file
- Solution: Check your `.env` file and verify the DB_PASSWORD matches your PostgreSQL password

**Error: "database 'library_management' does not exist"**
- Database was not created
- Solution: Follow Step 3 to create the database

**Error: "role 'postgres' does not exist"**
- PostgreSQL user issue
- Solution: Use the default `postgres` user or create a new user and update `.env`

### Port Already in Use

**Error: "Port 3000 is already in use"**
- Another application is using port 3000
- Solution: Change PORT in `.env` file to a different port (e.g., 3001)

### TypeORM Synchronize Issues

If you see errors about tables already existing:
- This is normal if you've run the app before
- TypeORM will update the schema automatically
- In production, set `NODE_ENV=production` to disable auto-sync

## Quick Start Commands Summary

```bash
# 1. Install dependencies
npm install

# 2. Create .env file with database credentials

# 3. Create database (using pgAdmin or psql)
createdb -U postgres library_management

# 4. Run the application
npm run start:dev

# 5. Create first librarian (in another terminal)
curl -X POST http://localhost:3000/librarians/setup -H "Content-Type: application/json" -d "{\"email\":\"admin@library.com\",\"password\":\"admin123\",\"name\":\"Admin Librarian\"}"
```

## Database Tables Created Automatically

The following tables will be created automatically when you run the application:

1. **users** - User accounts
2. **librarians** - Librarian accounts
3. **books** - Book catalog
4. **borrow_records** - Book borrowing history

## Next Steps

After setup is complete:
1. Create your first librarian (see Step 7)
2. Login to get a JWT token
3. Use the token to access protected endpoints
4. Start adding books, users, and managing the library!

For API documentation, see the main README.md file.

