import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Librarian } from '../librarians/entities/librarian.entity';
import { EmailService } from '../email/email.service';

interface TwoFactorCode {
  code: string;
  userId: number;
  role: 'user' | 'librarian';
  expiresAt: Date;
}

@Injectable()
export class TwoFactorService {
  private readonly logger = new Logger(TwoFactorService.name);
  // In-memory storage for 2FA codes (expires after 10 minutes)
  private codes: Map<string, TwoFactorCode> = new Map();

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Librarian)
    private librarianRepository: Repository<Librarian>,
    private emailService: EmailService,
  ) {
    // Clean up expired codes every minute
    setInterval(() => this.cleanupExpiredCodes(), 60000);
  }

  /**
   * Generate a random 6-digit code
   */
  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Send 2FA code via email
   */
  async sendTwoFactorCode(
    userId: number,
    role: 'user' | 'librarian',
    email: string,
    name: string,
  ): Promise<string> {
    // Generate a 6-digit code
    const code = this.generateCode();

    // Store the code (expires in 10 minutes)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    const codeKey = `${role}-${userId}`;
    this.codes.set(codeKey, {
      code,
      userId,
      role,
      expiresAt,
    });

    // Send email with the code
    await this.emailService.sendTwoFactorCode(email, name, code);

    this.logger.log(`2FA code sent to ${email} for ${role} ${userId}`);

    return code; // Return for testing purposes (in production, don't return)
  }

  /**
   * Verify a 2FA code
   */
  async verifyCode(
    userId: number,
    role: 'user' | 'librarian',
    code: string,
  ): Promise<boolean> {
    const codeKey = `${role}-${userId}`;
    const storedCode = this.codes.get(codeKey);

    if (!storedCode) {
      throw new BadRequestException('No 2FA code found. Please request a new code.');
    }

    if (new Date() > storedCode.expiresAt) {
      this.codes.delete(codeKey);
      throw new BadRequestException('2FA code has expired. Please request a new code.');
    }

    if (storedCode.code !== code) {
      throw new BadRequestException('Invalid 2FA code.');
    }

    // Code is valid - remove it (one-time use)
    this.codes.delete(codeKey);

    return true;
  }

  /**
   * Enable 2FA for a user (no verification needed - just enable it)
   */
  async enableTwoFactor(userId: number, role: 'user' | 'librarian'): Promise<boolean> {
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
   * Clean up expired codes
   */
  private cleanupExpiredCodes(): void {
    const now = new Date();
    for (const [key, codeData] of this.codes.entries()) {
      if (now > codeData.expiresAt) {
        this.codes.delete(key);
      }
    }
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

