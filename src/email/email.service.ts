import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  private isEmailConfigured: boolean;

  constructor(private configService: ConfigService) {
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPass = this.configService.get<string>('SMTP_PASS');
    
    this.isEmailConfigured = !!(smtpUser && smtpPass);

    if (this.isEmailConfigured) {
      this.transporter = nodemailer.createTransport({
        host: this.configService.get<string>('SMTP_HOST') || 'smtp.gmail.com',
        port: parseInt(this.configService.get<string>('SMTP_PORT') || '587', 10),
        secure: false, // true for 465, false for other ports
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
      this.logger.log('Email service configured and ready');
    } else {
      this.logger.warn('Email service not configured. SMTP_USER and SMTP_PASS are required in .env file. Login notifications will be skipped.');
    }
  }

  async sendLoginNotification(
    email: string,
    name: string,
    role: 'user' | 'librarian',
    loginTime: Date,
    ipAddress?: string,
  ): Promise<void> {
    const roleDisplay = role === 'librarian' ? 'Librarian' : 'User';
    const roleColor = role === 'librarian' ? '#4F46E5' : '#10B981';
    const roleIcon = role === 'librarian' ? '📚' : '👤';

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Notification - RCA Library Management System</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f3f4f6; padding: 20px;">
        <tr>
            <td align="center">
                <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, ${roleColor} 0%, ${roleColor}dd 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                                ${roleIcon} RCA Library Management System
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 24px; font-weight: 600;">
                                Login Successful! 🎉
                            </h2>
                            
                            <p style="margin: 0 0 20px 0; color: #4B5563; font-size: 16px; line-height: 1.6;">
                                Hello <strong>${name}</strong>,
                            </p>
                            
                            <p style="margin: 0 0 20px 0; color: #4B5563; font-size: 16px; line-height: 1.6;">
                                We're writing to confirm that you've successfully logged into your <strong>${roleDisplay}</strong> account.
                            </p>
                            
                            <!-- Login Details Box -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #F9FAFB; border-radius: 6px; padding: 20px; margin: 30px 0;">
                                <tr>
                                    <td>
                                        <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                            <tr>
                                                <td style="padding: 8px 0; color: #6B7280; font-size: 14px; width: 120px;">Account Type:</td>
                                                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">
                                                    <span style="display: inline-block; background-color: ${roleColor}15; color: ${roleColor}; padding: 4px 12px; border-radius: 4px; font-size: 13px;">
                                                        ${roleDisplay}
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Email:</td>
                                                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 500;">${email}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Login Time:</td>
                                                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 500;">${loginTime.toLocaleString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    })}</td>
                                            </tr>
                                            ${ipAddress ? `
                                            <tr>
                                                <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">IP Address:</td>
                                                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 500; font-family: monospace;">${ipAddress}</td>
                                            </tr>
                                            ` : ''}
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Security Notice -->
                            <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 16px; border-radius: 4px; margin: 30px 0;">
                                <p style="margin: 0; color: #92400E; font-size: 14px; line-height: 1.6;">
                                    <strong>🔒 Security Notice:</strong> If you didn't perform this login, please contact our support team immediately and change your password.
                                </p>
                            </div>
                            
                            <p style="margin: 30px 0 0 0; color: #4B5563; font-size: 16px; line-height: 1.6;">
                                Thank you for using our Library Management System!
                            </p>
                            
                            <p style="margin: 20px 0 0 0; color: #4B5563; font-size: 16px; line-height: 1.6;">
                                Best regards,<br>
                                <strong>The RCA Library Management Team</strong>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #F9FAFB; padding: 30px; text-align: center; border-top: 1px solid #E5E7EB;">
                            <p style="margin: 0 0 10px 0; color: #6B7280; font-size: 12px; line-height: 1.6;">
                                This is an automated notification. Please do not reply to this email.
                            </p>
                            <p style="margin: 0; color: #9CA3AF; font-size: 12px;">
                                © ${new Date().getFullYear()} Library Management System. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;

    const text = `
RCA Library Management System - Login Notification

Hello ${name},

We're writing to confirm that you've successfully logged into your ${roleDisplay} account.

Login Details:
- Account Type: ${roleDisplay}
- Email: ${email}
- Login Time: ${loginTime.toLocaleString()}
${ipAddress ? `- IP Address: ${ipAddress}` : ''}

Security Notice: If you didn't perform this login, please contact our support team immediately and change your password.

Thank you for using our Library Management System!

Best regards,
The RCA Library Management Team

---
This is an automated notification. Please do not reply to this email.
© ${new Date().getFullYear()} Library Management System. All rights reserved.
    `;

    const mailOptions = {
      from: `"RCA Library Management System" <${this.configService.get<string>('SMTP_USER')}>`,
      to: email,
      subject: `✅ Login Successful - ${roleDisplay} Account`,
      text: text,
      html: html,
    };

    if (!this.isEmailConfigured) {
      this.logger.warn(`Email not configured - skipping login notification for ${email}. Please set SMTP_USER and SMTP_PASS in .env file.`);
      return;
    }

    try {
      this.logger.log(`Attempting to send login notification email to ${email}...`);
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`✅ Login notification email sent successfully to ${email}. Message ID: ${info.messageId}`);
    } catch (error) {
      this.logger.error(`❌ Failed to send login notification email to ${email}:`, error);
      this.logger.error(`Error details: ${error.message}`);
      if (error.response) {
        this.logger.error(`SMTP Response: ${error.response}`);
      }
      // Don't throw error - email failure shouldn't break login
    }
  }

  async sendTwoFactorCode(email: string, name: string, code: string): Promise<void> {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your 2FA Code - Library Management System</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f3f4f6; padding: 20px;">
        <tr>
            <td align="center">
                <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                                🔐 Confirm Login to RCA Library Management System
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 24px; font-weight: 600;">
                                Your 2FA Code
                            </h2>
                            
                            <p style="margin: 0 0 20px 0; color: #4B5563; font-size: 16px; line-height: 1.6;">
                                Hello <strong>${name}</strong>,
                            </p>
                            
                            <p style="margin: 0 0 30px 0; color: #4B5563; font-size: 16px; line-height: 1.6;">
                                You're trying to log in to your Library Management System account. Use the code below to complete your login:
                            </p>
                            
                            <!-- Code Box -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                                <tr>
                                    <td align="center">
                                        <div style="background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); padding: 20px 40px; border-radius: 8px; display: inline-block;">
                                            <div style="font-size: 36px; font-weight: 700; color: #ffffff; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                                                ${code}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 30px 0 0 0; color: #6B7280; font-size: 14px; line-height: 1.6;">
                                This code will expire in <strong>10 minutes</strong>.
                            </p>
                            
                            <!-- Security Notice -->
                            <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 16px; border-radius: 4px; margin: 30px 0;">
                                <p style="margin: 0; color: #92400E; font-size: 14px; line-height: 1.6;">
                                    <strong>🔒 Security Notice:</strong> If you didn't request this code, please ignore this email and consider changing your password immediately.
                                </p>
                            </div>
                            
                            <p style="margin: 30px 0 0 0; color: #4B5563; font-size: 16px; line-height: 1.6;">
                                Best regards,<br>
                                <strong>The Library Management Team</strong>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #F9FAFB; padding: 30px; text-align: center; border-top: 1px solid #E5E7EB;">
                            <p style="margin: 0 0 10px 0; color: #6B7280; font-size: 12px; line-height: 1.6;">
                                This is an automated email. Please do not reply to this email.
                            </p>
                            <p style="margin: 0; color: #9CA3AF; font-size: 12px;">
                                © ${new Date().getFullYear()} Library Management System. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;

    const text = `
Two-Factor Authentication Code

Hello ${name},

You're trying to log in to your Library Management System account. Use the code below to complete your login:

${code}

This code will expire in 10 minutes.

Security Notice: If you didn't request this code, please ignore this email and consider changing your password immediately.

Best regards,
The Library Management Team

---
This is an automated email. Please do not reply to this email.
© ${new Date().getFullYear()} Library Management System. All rights reserved.
    `;

    const mailOptions = {
      from: `"Library Management System" <${this.configService.get<string>('SMTP_USER')}>`,
      to: email,
      subject: `🔐 Your 2FA Code: ${code}`,
      text: text,
      html: html,
    };

    if (!this.isEmailConfigured) {
      this.logger.warn(`Email not configured - cannot send 2FA code to ${email}. Please set SMTP_USER and SMTP_PASS in .env file.`);
      return;
    }

    try {
      this.logger.log(`Sending 2FA code to ${email}...`);
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`✅ 2FA code email sent successfully to ${email}. Message ID: ${info.messageId}`);
    } catch (error) {
      this.logger.error(`❌ Failed to send 2FA code email to ${email}:`, error);
      this.logger.error(`Error details: ${error.message}`);
      throw error; // Throw error for 2FA - this is critical
    }
  }
}

