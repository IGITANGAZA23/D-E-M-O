# Email Configuration Guide

This guide will help you set up email notifications for login events in the Library Management System.

## 📧 Email Service Setup

The application sends beautiful HTML email notifications whenever a user or librarian logs in. The emails include:
- Login confirmation
- Account type (User/Librarian)
- Login timestamp
- IP address (if available)
- Security notice

## 🔧 Configuration Steps

### For Gmail Users (Recommended for Development)

1. **Enable 2-Factor Authentication** on your Gmail account
   - Go to: https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate an App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "Library Management System" as the name
   - Click "Generate"
   - **Copy the 16-character password** (you'll need this)

3. **Update your `.env` file:**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-character-app-password
   ```

### For Other Email Providers

#### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

#### Yahoo Mail
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
```

#### Custom SMTP Server
```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-password
```

## 🧪 Testing Email Configuration

1. **Restart your server** after updating `.env`:
   ```bash
   npm run start:dev
   ```

2. **Login as a user or librarian:**
   ```bash
   POST http://localhost:3000/auth/login/user
   Body: {
     "email": "user@example.com",
     "password": "password123"
   }
   ```

3. **Check the email inbox** - You should receive a beautifully formatted login notification email!

## 🔒 Security Notes

- **Never commit your `.env` file** to version control
- Use **App Passwords** instead of your main account password
- For production, consider using dedicated email services like:
  - SendGrid
  - Mailgun
  - Amazon SES
  - Postmark

## 🐛 Troubleshooting

### "Invalid login" or "Authentication failed"
- Verify your SMTP credentials are correct
- For Gmail: Make sure you're using an App Password, not your regular password
- Check that 2FA is enabled (for Gmail)

### "Connection timeout"
- Check your firewall settings
- Verify SMTP_PORT is correct (587 for TLS, 465 for SSL)
- Some networks block SMTP ports - try a different network

### Emails not sending but no errors
- Check your spam/junk folder
- Verify the recipient email address is correct
- Check server logs for email service errors

## 📝 Email Template Customization

The email templates are located in `src/email/email.service.ts`. You can customize:
- Colors and styling
- Content and messaging
- Logo and branding
- Additional information

## 🚀 Production Recommendations

For production environments, consider:

1. **Using a dedicated email service:**
   - SendGrid (free tier: 100 emails/day)
   - Mailgun (free tier: 5,000 emails/month)
   - Amazon SES (very affordable)

2. **Environment-specific configuration:**
   - Use different email accounts for development and production
   - Set up email templates for different environments

3. **Error handling:**
   - Set up email delivery monitoring
   - Log email failures for debugging
   - Consider retry logic for failed sends

## 📧 Email Preview

The login notification emails include:
- ✅ Professional HTML design
- ✅ Responsive layout (mobile-friendly)
- ✅ Login details (time, IP address, account type)
- ✅ Security notice
- ✅ Plain text fallback

Enjoy your email notifications! 🎉

