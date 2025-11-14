# Simple Email-Based 2FA Guide

This guide explains how to use the simple email-based Two-Factor Authentication (2FA) in the Library Management System.

## 🔐 What is 2FA?

Two-Factor Authentication adds an extra layer of security to your account. After entering your password, you'll receive a 6-digit code via email that you need to enter to complete your login.

**No phone apps, no QR codes - just simple email codes!** 📧

## 🚀 Setting Up 2FA

### Step 1: Login to Your Account

First, login to get your access token:

```bash
POST http://localhost:3000/auth/login/user
Body: {
  "email": "user@example.com",
  "password": "password123"
}
```

Save the `access_token` from the response.

### Step 2: Enable 2FA

Simply enable 2FA with one request:

```bash
POST http://localhost:3000/two-factor/enable/user
Headers: {
  "Authorization": "Bearer YOUR_ACCESS_TOKEN"
}
```

**Response:**
```json
{
  "message": "2FA has been successfully enabled. You will receive a code via email when logging in.",
  "enabled": true
}
```

✅ **That's it! 2FA is now enabled!** No QR codes, no phone apps needed.

## 🔑 Logging In with 2FA

### Step 1: Initial Login

Login with your email and password:

```bash
POST http://localhost:3000/auth/login/user
Body: {
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (if 2FA is enabled):**
```json
{
  "requiresTwoFactor": true,
  "tempToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "2FA code has been sent to your email. Please check your inbox and provide the code.",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

**📧 Check your email!** You'll receive a beautiful email with a 6-digit code.

### Step 2: Verify 2FA Code

Get the 6-digit code from your email and verify it:

```bash
POST http://localhost:3000/auth/verify-2fa/user
Body: {
  "tempToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "twoFactorToken": "123456"
}
```

**Response:**
```json
{
  "requiresTwoFactor": false,
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

✅ **You're now logged in!** Use the `access_token` for authenticated requests.

## 📊 Check 2FA Status

Check if 2FA is enabled for your account:

```bash
GET http://localhost:3000/two-factor/status/user
Headers: {
  "Authorization": "Bearer YOUR_ACCESS_TOKEN"
}
```

**Response:**
```json
{
  "enabled": true
}
```

## 🚫 Disable 2FA

If you want to disable 2FA:

```bash
DELETE http://localhost:3000/two-factor/disable/user
Headers: {
  "Authorization": "Bearer YOUR_ACCESS_TOKEN"
}
```

**Response:**
```json
{
  "message": "2FA has been successfully disabled for your account.",
  "enabled": false
}
```

## 🔄 Complete Login Flow Example

### Without 2FA:
```bash
# Step 1: Login
POST /auth/login/user
→ Returns access_token directly
```

### With 2FA:
```bash
# Step 1: Login
POST /auth/login/user
→ Sends code to email
→ Returns tempToken (requires 2FA)

# Step 2: Check your email for the 6-digit code

# Step 3: Verify 2FA
POST /auth/verify-2fa/user
Body: {
  "tempToken": "...",
  "twoFactorToken": "123456"
}
→ Returns access_token
```

## 📧 Email Code Details

- **Code Format:** 6 digits (e.g., `123456`)
- **Expiration:** 10 minutes
- **One-time use:** Each code can only be used once
- **Automatic sending:** Code is sent automatically when you login with 2FA enabled

## 🛡️ Security Best Practices

1. **Keep your email secure** - Your email account is your second factor
2. **Don't share codes** - Never share your 2FA codes with anyone
3. **Check email regularly** - Make sure you can access your email when logging in
4. **Use a secure email** - Use a strong password and 2FA on your email account too

## 🐛 Troubleshooting

### "2FA code has been sent to your email" but no email received
- Check your spam/junk folder
- Verify your email address is correct
- Make sure email service is configured (see EMAIL_SETUP.md)
- Wait a few seconds - emails can take a moment to arrive

### "2FA code has expired"
- Codes expire after 10 minutes
- Login again to get a new code

### "No 2FA code found"
- The code may have expired or been used
- Login again to get a new code

### "Invalid 2FA code"
- Make sure you're entering all 6 digits
- Check that you're using the most recent code from your email
- Codes are case-sensitive (though they're all numbers)

### "Invalid or expired temporary token"
- The temporary token expires after 10 minutes
- Login again to get a new temporary token and code

## 📝 API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/two-factor/enable/:role` | Enable 2FA | Yes |
| GET | `/two-factor/status/:role` | Check if 2FA is enabled | Yes |
| DELETE | `/two-factor/disable/:role` | Disable 2FA | Yes |
| POST | `/auth/verify-2fa/:role` | Verify 2FA code during login | No |

## 🎯 For Librarians

All the same endpoints work for librarians - just replace `user` with `librarian` in the URLs:

```bash
POST /two-factor/enable/librarian
GET /two-factor/status/librarian
DELETE /two-factor/disable/librarian
POST /auth/verify-2fa/librarian
```

## ✨ Features

- ✅ **Simple** - No phone apps or QR codes needed
- ✅ **Email-based** - Receive codes directly in your inbox
- ✅ **Beautiful emails** - Professional, easy-to-read email templates
- ✅ **Secure** - 6-digit codes expire in 10 minutes
- ✅ **One-time use** - Each code can only be used once
- ✅ **Automatic** - Codes are sent automatically when logging in

Enjoy the simple and secure 2FA! 🔒📧
