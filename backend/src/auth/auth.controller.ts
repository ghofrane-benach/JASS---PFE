// backend/src/auth/auth.controller.ts
import {
  Controller, Post, Body, HttpCode, HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';

class LoginDto {
  email: string;
  password: string;
}

class RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /auth/register
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() dto: RegisterDto) {
    // ✅ CORRIGÉ — passe les bons paramètres au service
    const name = `${dto.firstName} ${dto.lastName}`.trim();
    return this.authService.register(name, dto.email, dto.password);
  }

  // POST /auth/login
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }
}