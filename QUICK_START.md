# Quick Start Guide

## 🚀 Fast Setup (5 minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Install PostgreSQL
- Download from: https://www.postgresql.org/download/windows/
- Install with default settings
- **Remember your postgres user password!**

### Step 3: Create Database
Open **pgAdmin** or **Command Prompt**:

**Using pgAdmin:**
1. Open pgAdmin
2. Right-click "Databases" → Create → Database
3. Name: `library_management`
4. Click Save

**Using Command Line:**
```bash
createdb -U postgres library_management
```

### Step 4: Create .env File
Create a file named `.env` in the root directory with:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=YOUR_POSTGRES_PASSWORD_HERE
DB_DATABASE=library_management

JWT_SECRET=my-super-secret-jwt-key-12345
PORT=3000
NODE_ENV=development
```

**⚠️ Replace `YOUR_POSTGRES_PASSWORD_HERE` with your actual PostgreSQL password!**

### Step 5: Run the Application
```bash
npm run start:dev
```

Wait for: `Application is running on: http://localhost:3000`

### Step 6: Create First Librarian

**Using PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/librarians/setup" -Method Post -ContentType "application/json" -Body '{"email":"admin@library.com","password":"admin123","name":"Admin Librarian"}'
```

**Using curl (if available):**
```bash
curl -X POST http://localhost:3000/librarians/setup -H "Content-Type: application/json" -d "{\"email\":\"admin@library.com\",\"password\":\"admin123\",\"name\":\"Admin Librarian\"}"
```

**Using Postman/Browser Extension:**
- POST to: `http://localhost:3000/librarians/setup`
- Headers: `Content-Type: application/json`
- Body:
  ```json
  {
    "email": "admin@library.com",
    "password": "admin123",
    "name": "Admin Librarian"
  }
  ```

### Step 7: Login and Get Token
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/auth/login/librarian" -Method Post -ContentType "application/json" -Body '{"email":"admin@library.com","password":"admin123"}'
```

You'll receive a token in the response. Use it in the `Authorization` header for protected endpoints:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

## ✅ Verification Checklist

- [ ] Node.js installed (`node --version`)
- [ ] PostgreSQL installed and running
- [ ] Database `library_management` created
- [ ] `.env` file created with correct credentials
- [ ] Dependencies installed (`npm install`)
- [ ] Application runs without errors (`npm run start:dev`)
- [ ] First librarian created successfully
- [ ] Can login and receive JWT token

## 🐛 Common Issues

**"Cannot connect to database"**
- Check PostgreSQL is running (Services → postgresql)
- Verify `.env` file has correct password
- Check database exists: `psql -U postgres -l`

**"Port 3000 already in use"**
- Change `PORT=3001` in `.env` file
- Or stop the application using port 3000

**"Module not found"**
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then `npm install`

## 📚 Next Steps

1. Read the full [SETUP.md](./SETUP.md) for detailed instructions
2. Check [README.md](./README.md) for API documentation
3. Start using the API endpoints!

## 🎯 Test the API

Once running, you can:
1. **Register a user:** `POST /users/register`
2. **Add a book (as librarian):** `POST /books` (with token)
3. **Borrow a book (as user):** `POST /borrow-records/borrow` (with token)
4. **View all books:** `GET /books` (with token)

See README.md for full API documentation.

## 🔍 Verify Your Setup

Run the setup check script:
```powershell
.\check-setup.ps1
```

This will verify that all prerequisites are installed and configured correctly.
