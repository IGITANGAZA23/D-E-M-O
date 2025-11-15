import {
  Controller,
  Post,
  Body,
  Param,
  BadRequestException,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { VerifyTwoFactorLoginDto } from './dto/verify-2fa-login.dto';
import { ApiTags, ApiBody } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Helper to validate role
  private validateRole(role: string) {
    const allowed = ['user', 'librarian'];
    if (!allowed.includes(role)) {
      throw new BadRequestException(
        `Invalid role "${role}". Must be either "user" or "librarian"`,
      );
    }
    return role as 'user' | 'librarian';
  }

  // Helper to get IP address
  private getClientIp(req: Request): string {
    return (
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      (req.headers['x-real-ip'] as string) ||
      req.socket.remoteAddress ||
      'Unknown'
    );
  }

  // ---------- LOGIN (STEP 1) ----------
  @Post('login/:role')
  @ApiBody({ type: LoginDto })
  async login(
    @Body() loginDto: LoginDto,
    @Param('role') role: string,
    @Req() req: Request,
  ) {
    const validatedRole = this.validateRole(role);
    const ipAddress = this.getClientIp(req);

    return this.authService.login(loginDto, validatedRole, ipAddress);
  }

  // ---------- VERIFY 2FA (STEP 2) ----------
  @Post('verify-2fa/:role')
  @ApiBody({ type: VerifyTwoFactorLoginDto })
  async verifyTwoFactor(
    @Body() verifyDto: VerifyTwoFactorLoginDto,
    @Param('role') role: string,
    @Req() req: Request,
  ) {
    const validatedRole = this.validateRole(role);
    const ipAddress = this.getClientIp(req);

    return this.authService.verifyTwoFactorAndLogin(
      verifyDto.tempToken,
      verifyDto.twoFactorToken,
      validatedRole,
      ipAddress,
    );
  }
}
