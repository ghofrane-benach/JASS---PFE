// backend/src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // ✅ Utilisé par JwtStrategy.validate()
  async validateUser(id: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { id } });
  }

  async register(name: string, email: string, password: string) {
    const existing = await this.userRepo.findOne({ where: { email } });
    if (existing) throw new UnauthorizedException('Email déjà utilisé');

    const hash = await bcrypt.hash(password, 10);
    const user = await this.userRepo.save(
      this.userRepo.create({ name, email, password: hash })
    );

    const token = this.jwtService.sign({
      sub:   user.id,
      email: user.email,
      role:  user.role,
    });

    return {
      access_token: token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Identifiants invalides');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Identifiants invalides');

    const token = this.jwtService.sign({
      sub:   user.id,
      email: user.email,
      role:  user.role,
    });

    return {
      access_token: token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  }
}