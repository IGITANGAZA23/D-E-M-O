import { Controller, Post, Body, Get } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('test')
  async testEmail(@Body() body: { email: string; name?: string }) {
    try {
      await this.emailService.sendLoginNotification(
        body.email,
        body.name || 'Test User',
        'user',
        new Date(),
        '127.0.0.1',
      );
      return {
        success: true,
        message: `Test email sent to ${body.email}. Please check your inbox (and spam folder).`,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send test email',
        error: error.message,
      };
    }
  }

  @Get('status')
  getEmailStatus() {
    // This will check if email is configured by trying to access the service
    return {
      message: 'Email service is available. Use POST /email/test to send a test email.',
      endpoint: 'POST /email/test',
      body: {
        email: 'your-email@example.com',
        name: 'Test User (optional)',
      },
    };
  }
}

