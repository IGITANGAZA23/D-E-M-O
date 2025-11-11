import { Controller, Post, Body, Param, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/:role')
  async login(@Body() loginDto: LoginDto, @Param('role') role: string) {
    if (role !== 'user' && role !== 'librarian') {
      throw new BadRequestException('Invalid role. Must be "user" or "librarian"');
    }
    return this.authService.login(loginDto, role as 'user' | 'librarian');
  }
}

