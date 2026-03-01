import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
  }) {
    // Vérifier si email déjà utilisé
    const existing = await this.userRepository.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Cet email est déjà utilisé');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.userRepository.create({
      first_name: dto.firstName,
      last_name:  dto.lastName,
      email:     dto.email,
      phone:     dto.phone,
      password:  hashedPassword,
    } as any);

    const saved = await this.userRepository.save(user);
    const { password, ...result } = saved as any;
    return result;
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Email ou mot de passe incorrect');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Email ou mot de passe incorrect');

    const payload = { sub: user.id, email: user.email };
    const access_token = this.jwtService.sign(payload);

    const { password: _, ...userWithoutPassword } = user as any;
    return { access_token, user: userWithoutPassword };
  }

  async validateUser(userId: string) {
    return this.userRepository.findOne({ where: { id: userId } });
  }
}