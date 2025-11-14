import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Param,
  Delete,
} from '@nestjs/common';
import { TwoFactorService } from './two-factor.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/guards/roles.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { EnableTwoFactorDto } from './dto/enable-2fa.dto';
import { VerifyTwoFactorDto } from './dto/verify-2fa.dto';

@Controller('two-factor')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TwoFactorController {
  constructor(private readonly twoFactorService: TwoFactorService) {}

  /**
   * Generate 2FA secret and QR code
   */
  @Post('setup/:role')
  @Roles(Role.User, Role.Librarian)
  async setupTwoFactor(
    @Param('role') role: string,
    @GetUser() user: any,
  ) {
    if (role !== 'user' && role !== 'librarian') {
      throw new Error('Invalid role');
    }

    // Get user details
    const userId = user.userId;
    const email = user.email;
    const name = user.name || 'User';

    const result = await this.twoFactorService.generateSecret(
      userId,
      role as 'user' | 'librarian',
      email,
      name,
    );

    return {
      message: '2FA secret generated. Scan the QR code with your authenticator app and then enable 2FA.',
      qrCode: result.qrCode,
      manualEntryKey: result.manualEntryKey,
      secret: result.secret,
    };
  }

  /**
   * Enable 2FA after verifying the token
   */
  @Post('enable/:role')
  @Roles(Role.User, Role.Librarian)
  async enableTwoFactor(
    @Param('role') role: string,
    @Body() enableDto: EnableTwoFactorDto,
    @GetUser() user: any,
  ) {
    if (role !== 'user' && role !== 'librarian') {
      throw new Error('Invalid role');
    }

    await this.twoFactorService.enableTwoFactor(
      user.userId,
      role as 'user' | 'librarian',
      enableDto.token,
    );

    return {
      message: '2FA has been successfully enabled for your account.',
      enabled: true,
    };
  }

  /**
   * Disable 2FA
   */
  @Delete('disable/:role')
  @Roles(Role.User, Role.Librarian)
  async disableTwoFactor(
    @Param('role') role: string,
    @GetUser() user: any,
  ) {
    if (role !== 'user' && role !== 'librarian') {
      throw new Error('Invalid role');
    }

    await this.twoFactorService.disableTwoFactor(
      user.userId,
      role as 'user' | 'librarian',
    );

    return {
      message: '2FA has been successfully disabled for your account.',
      enabled: false,
    };
  }

  /**
   * Check 2FA status
   */
  @Get('status/:role')
  @Roles(Role.User, Role.Librarian)
  async getTwoFactorStatus(
    @Param('role') role: string,
    @GetUser() user: any,
  ) {
    if (role !== 'user' && role !== 'librarian') {
      throw new Error('Invalid role');
    }

    const isEnabled = await this.twoFactorService.isTwoFactorEnabled(
      user.userId,
      role as 'user' | 'librarian',
    );

    return {
      enabled: isEnabled,
    };
  }
}

