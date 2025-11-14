import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { User } from '../users/entities/user.entity';
import { Librarian } from '../librarians/entities/librarian.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TwoFactorService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Librarian)
    private librarianRepository: Repository<Librarian>,
    private configService: ConfigService,
  ) {}

  /**
   * Generate a 2FA secret for a user
   */
  async generateSecret(userId: number, role: 'user' | 'librarian', email: string, name: string) {
    const secret = speakeasy.generateSecret({
      name: `Library Management (${email})`,
      issuer: 'Library Management System',
      length: 32,
    });

    // Save the secret temporarily (not enabled yet)
    if (role === 'user') {
      await this.userRepository.update(userId, {
        twoFactorSecret: secret.base32,
      });
    } else {
      await this.librarianRepository.update(userId, {
        twoFactorSecret: secret.base32,
      });
    }

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);

    return {
      secret: secret.base32,
      qrCode: qrCodeUrl,
      manualEntryKey: secret.base32,
    };
  }

  /**
   * Verify a 2FA token
   */
  async verifyToken(
    userId: number,
    role: 'user' | 'librarian',
    token: string,
  ): Promise<boolean> {
    let entity: User | Librarian | null = null;

    if (role === 'user') {
      entity = await this.userRepository.findOne({ where: { id: userId } });
    } else {
      entity = await this.librarianRepository.findOne({ where: { id: userId } });
    }

    if (!entity || !entity.twoFactorSecret) {
      throw new BadRequestException('2FA is not set up for this account');
    }

    const verified = speakeasy.totp.verify({
      secret: entity.twoFactorSecret,
      encoding: 'base32',
      token: token,
      window: 2, // Allow 2 time steps (60 seconds) of tolerance
    });

    return verified;
  }

  /**
   * Enable 2FA for a user after they verify the token
   */
  async enableTwoFactor(userId: number, role: 'user' | 'librarian', token: string): Promise<boolean> {
    const isValid = await this.verifyToken(userId, role, token);

    if (!isValid) {
      throw new BadRequestException('Invalid 2FA token');
    }

    if (role === 'user') {
      await this.userRepository.update(userId, {
        isTwoFactorEnabled: true,
      });
    } else {
      await this.librarianRepository.update(userId, {
        isTwoFactorEnabled: true,
      });
    }

    return true;
  }

  /**
   * Disable 2FA for a user
   */
  async disableTwoFactor(userId: number, role: 'user' | 'librarian'): Promise<boolean> {
    if (role === 'user') {
      await this.userRepository.update(userId, {
        isTwoFactorEnabled: false,
        twoFactorSecret: null,
      });
    } else {
      await this.librarianRepository.update(userId, {
        isTwoFactorEnabled: false,
        twoFactorSecret: null,
      });
    }

    return true;
  }

  /**
   * Check if 2FA is enabled for a user
   */
  async isTwoFactorEnabled(userId: number, role: 'user' | 'librarian'): Promise<boolean> {
    let entity: User | Librarian | null = null;

    if (role === 'user') {
      entity = await this.userRepository.findOne({ where: { id: userId } });
    } else {
      entity = await this.librarianRepository.findOne({ where: { id: userId } });
    }

    return entity?.isTwoFactorEnabled || false;
  }
}

