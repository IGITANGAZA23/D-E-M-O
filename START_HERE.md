# 🎯 START HERE - Database Connection & Running Guide

## 📋 Prerequisites Checklist

Before starting, make sure you have:
- ✅ Node.js installed ([Download](https://nodejs.org/))
- ✅ PostgreSQL installed ([Download](https://www.postgresql.org/download/windows/))
- ✅ Terminal/Command Prompt ready

## 🚀 Step-by-Step Instructions

### 1️⃣ Install Dependencies

Open your terminal in the project folder and run:

```bash
npm install
```

This installs NestJS, TypeORM, PostgreSQL driver, and other dependencies.

**Expected output:** Packages will be installed (may take 1-2 minutes)

---

### 2️⃣ Install PostgreSQL (if not installed)

1. Download PostgreSQL: https://www.postgresql.org/download/windows/
2. Run the installer
3. **Important:** Remember the password you set for the `postgres` user!
4. Complete the installation

**Verify installation:**
```bash
psql --version
```

---

### 3️⃣ Start PostgreSQL Service

**Windows:**
- Press `Win + R`
- Type: `services.msc`
- Find "postgresql-x64-XX" service
- Right-click → Start (if not running)

**Or:** PostgreSQL usually starts automatically after installation.

---

### 4️⃣ Create the Database

**Option A: Using pgAdmin (GUI - Recommended for beginners)**

1. Open **pgAdmin** (installed with PostgreSQL)
2. Connect to PostgreSQL server (enter your password)
3. Right-click on **Databases** → **Create** → **Database**
4. Name: `library_management`
5. Click **Save**

**Option B: Using Command Line**

```bash
# Open Command Prompt or PowerShell
createdb -U postgres library_management
```

Enter your PostgreSQL password when prompted.

**Verify database was created:**
```bash
psql -U postgres -l
```

You should see `library_management` in the list.

---

### 5️⃣ Create .env File

1. In the project root folder, create a new file named `.env`
2. Copy and paste this content:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=YOUR_POSTGRES_PASSWORD_HERE
DB_DATABASE=library_management

JWT_SECRET=my-super-secret-jwt-key-change-in-production-12345
PORT=3000
NODE_ENV=development
```

3. **Replace `YOUR_POSTGRES_PASSWORD_HERE`** with your actual PostgreSQL password!

**Example:**
```env
DB_PASSWORD=postgres123
```

---

### 6️⃣ Run the Application

```bash
npm run start:dev
```

**Expected output:**
```
[Nest] INFO  [NestFactory] Starting Nest application...
[Nest] INFO  [InstanceLoader] AppModule dependencies initialized
[Nest] INFO  [InstanceLoader] TypeOrmModule dependencies initialized
...
[Nest] INFO  Application is running on: http://localhost:3000
```

✅ **If you see "Application is running on: http://localhost:3000", you're good!**

The database tables will be created automatically by TypeORM.

---

### 7️⃣ Create Your First Librarian

Open a **new terminal window** (keep the server running in the first one).

**Using PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/librarians/setup" -Method Post -ContentType "application/json" -Body '{"email":"admin@library.com","password":"admin123","name":"Admin Librarian"}'
```

**Using curl (if installed):**
```bash
curl -X POST http://localhost:3000/librarians/setup -H "Content-Type: application/json" -d "{\"email\":\"admin@library.com\",\"password\":\"admin123\",\"name\":\"Admin Librarian\"}"
```

**Using Postman:**
- Method: `POST`
- URL: `http://localhost:3000/librarians/setup`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
  ```json
  {
    "email": "admin@library.com",
    "password": "admin123",
    "name": "Admin Librarian"
  }
  ```

**Expected response:**
```json
{
  "id": 1,
  "email": "admin@library.com",
  "name": "Admin Librarian",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### 8️⃣ Login and Get JWT Token

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/auth/login/librarian" -Method Post -ContentType "application/json" -Body '{"email":"admin@library.com","password":"admin123"}'
```

**Expected response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@library.com",
    "name": "Admin Librarian",
    "role": "librarian"
  }
}
```

**Copy the `access_token`** - you'll need it for authenticated requests!

---

## ✅ Success! Your Application is Running

Your library management system is now running at:
- **URL:** http://localhost:3000
- **Database:** Connected to PostgreSQL
- **Tables:** Created automatically
- **First Librarian:** Created and ready to use

## 🔍 Verify Database Connection

The application automatically connects to PostgreSQL when it starts. If you see:
- ✅ "Application is running on: http://localhost:3000"
- ✅ No database connection errors

Then your database is connected successfully!

## 🐛 Troubleshooting

### Error: "Cannot connect to database"

**Checklist:**
1. ✅ PostgreSQL service is running (see Step 3)
2. ✅ Database `library_management` exists (see Step 4)
3. ✅ `.env` file has correct password (see Step 5)
4. ✅ Database credentials in `.env` are correct

**Test database connection:**
```bash
psql -U postgres -d library_management
```

If this works, your database is accessible.

### Error: "Port 3000 already in use"

**Solution:** Change the port in `.env`:
```env
PORT=3001
```

Then restart the application.

### Error: "password authentication failed"

**Solution:** Check your `.env` file - the `DB_PASSWORD` must match your PostgreSQL password exactly.

## 📚 Next Steps

1. **Read API Documentation:** See [README.md](./README.md)
2. **Detailed Setup Guide:** See [SETUP.md](./SETUP.md)
3. **Quick Reference:** See [QUICK_START.md](./QUICK_START.md)

## 🎯 Test Your API

Try these endpoints:

1. **Register a user:**
   ```
   POST http://localhost:3000/users/register
   Body: {"email":"user@example.com","password":"password123","name":"John Doe"}
   ```

2. **Login as user:**
   ```
   POST http://localhost:3000/auth/login/user
   Body: {"email":"user@example.com","password":"password123"}
   ```

3. **Add a book (as librarian - requires token):**
   ```
   POST http://localhost:3000/books
   Headers: Authorization: Bearer YOUR_TOKEN_HERE
   Body: {"title":"The Great Gatsby","author":"F. Scott Fitzgerald","isbn":"9780743273565"}
   ```

## 🎉 You're All Set!

Your library management system is ready to use. Happy coding! 🚀

