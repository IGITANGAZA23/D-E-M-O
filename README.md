# Library Management System

A NestJS-based backend library management system with PostgreSQL database, featuring authentication, role-based access control, and book borrowing functionality.

## Features

- **User Management**: CRUD operations for users
- **Librarian Management**: CRUD operations for librarians
- **Book Management**: CRUD operations for books (librarians only)
- **Authentication**: JWT-based authentication for users and librarians
- **Book Borrowing**: Users can borrow and return books
- **Role-Based Access Control**: Different permissions for users and librarians

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Quick Start

**👉 NEW USER? Start here: [START_HERE.md](./START_HERE.md)** - Complete step-by-step guide  
**👉 For detailed setup instructions, see [SETUP.md](./SETUP.md)**  
**👉 For a quick 5-minute setup, see [QUICK_START.md](./QUICK_START.md)**

### Quick Setup Summary:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install PostgreSQL** and create database `library_management`

3. **Create `.env` file** in root directory:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_postgres_password
   DB_DATABASE=library_management
   JWT_SECRET=your-secret-key-change-in-production
   PORT=3000
   NODE_ENV=development
   ```

4. **Run the application:**
   ```bash
   npm run start:dev
   ```

5. **Create first librarian:**
   ```bash
   POST http://localhost:3000/librarians/setup
   ```

The application will run on `http://localhost:3000`

## API Endpoints

### Authentication

#### Login (User or Librarian)
- **POST** `/auth/login/:role`
  - `role` can be `user` or `librarian`
  - Body: `{ "email": "user@example.com", "password": "password123" }`
  - Returns: JWT token and user information

### Users

#### Register User (Public)
- **POST** `/users/register`
  - Body: `{ "email": "user@example.com", "password": "password123", "name": "John Doe" }`

#### Get All Users (Librarian only)
- **GET** `/users`
  - Headers: `Authorization: Bearer <token>`

#### Get User by ID (Librarian or User)
- **GET** `/users/:id`
  - Headers: `Authorization: Bearer <token>`

#### Update User (Librarian or User)
- **PATCH** `/users/:id`
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "name": "Updated Name" }`

#### Delete User (Librarian only)
- **DELETE** `/users/:id`
  - Headers: `Authorization: Bearer <token>`

### Librarians

#### Setup First Librarian (Public - for initial setup)
- **POST** `/librarians/setup`
  - Body: `{ "email": "admin@library.com", "password": "admin123", "name": "Admin Librarian" }`
  - Note: Use this endpoint to create the first librarian. After that, use the authenticated endpoint.

#### Create Librarian (Librarian only)
- **POST** `/librarians`
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "email": "librarian@example.com", "password": "password123", "name": "Jane Librarian" }`

#### Get All Librarians (Librarian only)
- **GET** `/librarians`
  - Headers: `Authorization: Bearer <token>`

#### Get Librarian by ID (Librarian only)
- **GET** `/librarians/:id`
  - Headers: `Authorization: Bearer <token>`

#### Update Librarian (Librarian only)
- **PATCH** `/librarians/:id`
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "name": "Updated Name" }`

#### Delete Librarian (Librarian only)
- **DELETE** `/librarians/:id`
  - Headers: `Authorization: Bearer <token>`

### Books

#### Create Book (Librarian only)
- **POST** `/books`
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "title": "Book Title", "author": "Author Name", "isbn": "1234567890" }`

#### Get All Books (User or Librarian)
- **GET** `/books`
  - Headers: `Authorization: Bearer <token>`

#### Get Book by ID (User or Librarian)
- **GET** `/books/:id`
  - Headers: `Authorization: Bearer <token>`

#### Update Book (Librarian only)
- **PATCH** `/books/:id`
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "title": "Updated Title" }`

#### Delete Book (Librarian only)
- **DELETE** `/books/:id`
  - Headers: `Authorization: Bearer <token>`

### Borrow Records

#### Borrow a Book (User only)
- **POST** `/borrow-records/borrow`
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "bookId": 1 }`

#### Return a Book (User only)
- **POST** `/borrow-records/return/:bookId`
  - Headers: `Authorization: Bearer <token>`

#### Get My Borrowed Books (User only)
- **GET** `/borrow-records/my-books`
  - Headers: `Authorization: Bearer <token>`

#### Get My Borrow History (User only)
- **GET** `/borrow-records/my-history`
  - Headers: `Authorization: Bearer <token>`

#### Get All Borrow Records (Librarian only)
- **GET** `/borrow-records/all`
  - Headers: `Authorization: Bearer <token>`

## Initial Setup

1. Create the first librarian (required before using the system):
```bash
curl -X POST http://localhost:3000/librarians/setup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@library.com",
    "password": "admin123",
    "name": "Admin Librarian"
  }'
```

2. Login as the librarian to get a token:
```bash
curl -X POST http://localhost:3000/auth/login/librarian \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@library.com",
    "password": "admin123"
  }'
```

## Usage Examples

### 1. Register a User
```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

### 2. Login as User
```bash
curl -X POST http://localhost:3000/auth/login/user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### 3. Create a Librarian (requires librarian token)
```bash
curl -X POST http://localhost:3000/librarians \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <librarian_token>" \
  -d '{
    "email": "librarian@example.com",
    "password": "password123",
    "name": "Jane Librarian"
  }'
```

### 4. Add a Book (requires librarian token)
```bash
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <librarian_token>" \
  -d '{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "isbn": "9780743273565"
  }'
```

### 5. Borrow a Book (requires user token)
```bash
curl -X POST http://localhost:3000/borrow-records/borrow \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <user_token>" \
  -d '{
    "bookId": 1
  }'
```

### 6. Return a Book (requires user token)
```bash
curl -X POST http://localhost:3000/borrow-records/return/1 \
  -H "Authorization: Bearer <user_token>"
```

## Database Schema

### Users
- id (Primary Key)
- email (Unique)
- password (Hashed)
- name
- createdAt
- updatedAt

### Librarians
- id (Primary Key)
- email (Unique)
- password (Hashed)
- name
- createdAt
- updatedAt

### Books
- id (Primary Key)
- title
- author
- isbn
- status (available/borrowed)
- createdAt
- updatedAt

### Borrow Records
- id (Primary Key)
- userId (Foreign Key)
- bookId (Foreign Key)
- status (borrowed/returned)
- borrowDate
- returnDate
- createdAt
- updatedAt

## Security

- Passwords are hashed using bcrypt
- JWT tokens are used for authentication
- Role-based access control (RBAC) is implemented
- Input validation using class-validator

## Development

```bash
# Run tests
npm test

# Run e2e tests
npm run test:e2e

# Lint code
npm run lint
```

## License

This project is licensed under the UNLICENSED license.
