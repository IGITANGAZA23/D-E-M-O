import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { Librarian } from '../librarians/entities/librarian.entity';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Librarian)
    private librarianRepository: Repository<Librarian>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto, role: 'user' | 'librarian') {
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

    const payload: JwtPayload = {
      sub: entity.id,
      email: entity.email,
      role: role,
    };

    return {
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

