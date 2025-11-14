import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { Librarian } from '../librarians/entities/librarian.entity';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './strategies/jwt.strategy';
import { EmailService } from '../email/email.service';
import { TwoFactorService } from '../two-factor/two-factor.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Librarian)
    private librarianRepository: Repository<Librarian>,
    private jwtService: JwtService,
    private emailService: EmailService,
    private twoFactorService: TwoFactorService,
  ) {}

  async login(loginDto: LoginDto, role: 'user' | 'librarian', ipAddress?: string) {
    let entity: User | Librarian | null = null;

    if (role === 'user') {
      entity = await this.userRepository.findOne({
        where: { email: loginDto.email },
      });
    } else {
      entity = await this.librarianRepository.findOne({
        where: { email: loginDto.email },
      });
    }

    if (!entity) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      entity.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if 2FA is enabled
    if (entity.isTwoFactorEnabled) {
      // Return a temporary token that requires 2FA verification
      const tempPayload: JwtPayload = {
        sub: entity.id,
        email: entity.email,
        role: role,
      };

      // Create a short-lived token for 2FA verification (5 minutes)
      const tempToken = this.jwtService.sign(tempPayload, { expiresIn: '5m' });

      return {
        requiresTwoFactor: true,
        tempToken: tempToken,
        message: '2FA verification required. Please provide your 2FA code.',
        user: {
          id: entity.id,
          email: entity.email,
          name: entity.name,
          role: role,
        },
      };
    }

    // No 2FA required - proceed with normal login
    const payload: JwtPayload = {
      sub: entity.id,
      email: entity.email,
      role: role,
    };

    const loginTime = new Date();

    // Send login notification email (non-blocking)
    this.emailService
      .sendLoginNotification(
        entity.email,
        entity.name,
        role,
        loginTime,
        ipAddress,
      )
      .catch((error) => {
        // Log error but don't fail the login
        // Error is already logged in EmailService
      });

    return {
      requiresTwoFactor: false,
      access_token: this.jwtService.sign(payload),
      user: {
        id: entity.id,
        email: entity.email,
        name: entity.name,
        role: role,
      },
    };
  }

  /**
   * Verify 2FA token and complete login
   */
  async verifyTwoFactorAndLogin(
    tempToken: string,
    twoFactorToken: string,
    role: 'user' | 'librarian',
    ipAddress?: string,
  ) {
    // Verify the temporary token
    let decoded: JwtPayload;
    try {
      decoded = this.jwtService.verify<JwtPayload>(tempToken);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired temporary token');
    }

    // Verify 2FA token
    const isValid = await this.twoFactorService.verifyToken(
      decoded.sub,
      role,
      twoFactorToken,
    );

    if (!isValid) {
      throw new BadRequestException('Invalid 2FA token');
    }

    // Get user entity
    let entity: User | Librarian | null = null;
    if (role === 'user') {
      entity = await this.userRepository.findOne({
        where: { id: decoded.sub },
      });
    } else {
      entity = await this.librarianRepository.findOne({
        where: { id: decoded.sub },
      });
    }

    if (!entity) {
      throw new UnauthorizedException('User not found');
    }

    // Create final access token
    const payload: JwtPayload = {
      sub: entity.id,
      email: entity.email,
      role: role,
    };

    const loginTime = new Date();

    // Send login notification email (non-blocking)
    this.emailService
      .sendLoginNotification(
        entity.email,
        entity.name,
        role,
        loginTime,
        ipAddress,
      )
      .catch((error) => {
        // Log error but don't fail the login
      });

    return {
      requiresTwoFactor: false,
      access_token: this.jwtService.sign(payload),
      user: {
        id: entity.id,
        email: entity.email,
        name: entity.name,
        role: role,
      },
    };
  }

  async validateUser(userId: number, role: string): Promise<any> {
    if (role === 'user') {
      return await this.userRepository.findOne({ where: { id: userId } });
    } else if (role === 'librarian') {
      return await this.librarianRepository.findOne({ where: { id: userId } });
    }
    return null;
  }
}

