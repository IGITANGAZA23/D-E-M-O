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

@Controller('two-factor')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TwoFactorController {
  constructor(private readonly twoFactorService: TwoFactorService) {}

  /**
   * Enable 2FA - simple, no verification needed
   */
  @Post('enable/:role')
  @Roles(Role.User, Role.Librarian)
  async enableTwoFactor(
    @Param('role') role: string,
    @GetUser() user: any,
  ) {
    if (role !== 'user' && role !== 'librarian') {
      throw new Error('Invalid role');
    }

    await this.twoFactorService.enableTwoFactor(
      user.userId,
      role as 'user' | 'librarian',
    );

    return {
      message: '2FA has been successfully enabled. You will receive a code via email when logging in.',
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

