# Two-Factor Authentication (2FA) Guide

This guide explains how to set up and use Two-Factor Authentication (2FA) in the Library Management System.

## 🔐 What is 2FA?

Two-Factor Authentication adds an extra layer of security to your account. After entering your password, you'll need to provide a 6-digit code from an authenticator app on your phone.

## 📱 Supported Authenticator Apps

You can use any TOTP-compatible authenticator app:
- **Google Authenticator** (iOS/Android)
- **Microsoft Authenticator** (iOS/Android)
- **Authy** (iOS/Android/Desktop)
- **1Password** (iOS/Android/Desktop)
- **LastPass Authenticator** (iOS/Android)
- Any other TOTP-compatible app

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

### Step 2: Generate 2FA Secret and QR Code

Use your access token to generate a 2FA secret:

```bash
POST http://localhost:3000/two-factor/setup/user
Headers: {
  "Authorization": "Bearer YOUR_ACCESS_TOKEN"
}
```

**Response:**
```json
{
  "message": "2FA secret generated. Scan the QR code with your authenticator app and then enable 2FA.",
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANS...",
  "manualEntryKey": "JBSWY3DPEHPK3PXP",
  "secret": "JBSWY3DPEHPK3PXP"
}
```

### Step 3: Scan QR Code

1. Open your authenticator app (e.g., Google Authenticator)
2. Tap "Add account" or the "+" button
3. Choose "Scan QR code"
4. Scan the QR code from the response (use the `qrCode` field - it's a base64 data URL)

**Alternative: Manual Entry**
If you can't scan the QR code, manually enter the `manualEntryKey` into your authenticator app.

### Step 4: Enable 2FA

After scanning the QR code, your authenticator app will show a 6-digit code. Use this code to enable 2FA:

```bash
POST http://localhost:3000/two-factor/enable/user
Headers: {
  "Authorization": "Bearer YOUR_ACCESS_TOKEN"
}
Body: {
  "token": "123456"
}
```

**Response:**
```json
{
  "message": "2FA has been successfully enabled for your account.",
  "enabled": true
}
```

✅ **2FA is now enabled!** You'll need to provide a 2FA code every time you login.

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
  "message": "2FA verification required. Please provide your 2FA code.",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

### Step 2: Verify 2FA Code

Get the 6-digit code from your authenticator app and verify it:

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
→ Returns tempToken (requires 2FA)

# Step 2: Verify 2FA
POST /auth/verify-2fa/user
→ Returns access_token
```

## 🛡️ Security Best Practices

1. **Keep your authenticator app secure** - Don't share your phone or authenticator app
2. **Backup codes** - Some authenticator apps allow you to backup your accounts
3. **Multiple devices** - You can add the same 2FA secret to multiple devices
4. **Time sync** - Make sure your phone's time is synchronized (authenticator apps require accurate time)

## 🐛 Troubleshooting

### "Invalid 2FA token"
- Make sure you're using the current 6-digit code from your authenticator app
- Codes expire every 30 seconds - get a fresh code
- Check that your phone's time is synchronized

### "Invalid or expired temporary token"
- The temporary token expires after 5 minutes
- Login again to get a new temporary token

### "2FA is not set up for this account"
- You need to set up 2FA first using `/two-factor/setup/:role`
- Make sure you've enabled 2FA after scanning the QR code

### QR Code not scanning
- Use the `manualEntryKey` to manually add the account to your authenticator app
- Make sure the QR code image is clear and well-lit

## 📝 API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/two-factor/setup/:role` | Generate 2FA secret and QR code | Yes |
| POST | `/two-factor/enable/:role` | Enable 2FA after verification | Yes |
| GET | `/two-factor/status/:role` | Check if 2FA is enabled | Yes |
| DELETE | `/two-factor/disable/:role` | Disable 2FA | Yes |
| POST | `/auth/verify-2fa/:role` | Verify 2FA code during login | No |

## 🎯 For Librarians

All the same endpoints work for librarians - just replace `user` with `librarian` in the URLs:

```bash
POST /two-factor/setup/librarian
POST /two-factor/enable/librarian
GET /two-factor/status/librarian
DELETE /two-factor/disable/librarian
POST /auth/verify-2fa/librarian
```

Enjoy the enhanced security! 🔒

