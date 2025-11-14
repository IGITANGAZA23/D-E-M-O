import { Controller, Post, Body, Param, BadRequestException, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { VerifyTwoFactorLoginDto } from './dto/verify-2fa-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/:role')
  async login(
    @Body() loginDto: LoginDto,
    @Param('role') role: string,
    @Req() req: Request,
  ) {
    if (role !== 'user' && role !== 'librarian') {
      throw new BadRequestException('Invalid role. Must be "user" or "librarian"');
    }
    
    // Extract IP address from request
    const ipAddress =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      (req.headers['x-real-ip'] as string) ||
      req.socket.remoteAddress ||
      'Unknown';

    return this.authService.login(loginDto, role as 'user' | 'librarian', ipAddress);
  }

  @Post('verify-2fa/:role')
  async verifyTwoFactor(
    @Body() verifyDto: VerifyTwoFactorLoginDto,
    @Param('role') role: string,
    @Req() req: Request,
  ) {
    if (role !== 'user' && role !== 'librarian') {
      throw new BadRequestException('Invalid role. Must be "user" or "librarian"');
    }

    // Extract IP address from request
    const ipAddress =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      (req.headers['x-real-ip'] as string) ||
      req.socket.remoteAddress ||
      'Unknown';

    return this.authService.verifyTwoFactorAndLogin(
      verifyDto.tempToken,
      verifyDto.twoFactorToken,
      role as 'user' | 'librarian',
      ipAddress,
    );
  }
}

