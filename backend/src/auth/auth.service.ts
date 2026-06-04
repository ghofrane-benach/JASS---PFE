// backend/src/auth/auth.service.ts
import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User } from '../users/user.entity';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,

    // ✅ Injection du service email
    private readonly emailService: EmailService,
  ) {}

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
    const users = await this.userRepo.query(
      `SELECT * FROM "user" WHERE email = $1 LIMIT 1`,
      [email]
    );

    const user = users?.[0];

    console.log('🔍 Login attempt:', email);
    console.log('🔍 User found:', !!user);
    console.log('🔍 Has password:', !!user?.password);

    if (!user) throw new UnauthorizedException('Identifiants invalides');
    if (!user.password) throw new UnauthorizedException('Identifiants invalides');

    const valid = await bcrypt.compare(password, user.password);
    console.log('🔍 Password valid:', valid);

    if (!valid) throw new UnauthorizedException('Identifiants invalides');

    const token = this.jwtService.sign({
      sub:   user.id,
      email: user.email,
      role:  user.role,
    });

    return {
      access_token: token,
      user: {
        id:    user.id,
        name:  user.name,
        email: user.email,
        role:  user.role,
      },
    };
  }

  // ✅ NOUVEAU — Demande de réinitialisation mot de passe
  async requestPasswordReset(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });

    // Sécurité : ne pas révéler si l'email existe ou non
    if (!user) return { message: 'Si cet email existe, un lien de réinitialisation a été envoyé.' };

    // Générer un token sécurisé
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 heure

    // Sauvegarder le token en base
    await this.userRepo.update(user.id, {
      resetToken,
      resetTokenExpiry,
    });

    // Envoyer l'email
    await this.emailService.sendPasswordReset({
      email: user.email,
      name:  user.name,
      resetToken,
    });

    return { message: 'Si cet email existe, un lien de réinitialisation a été envoyé.' };
  }

  // ✅ NOUVEAU — Réinitialisation du mot de passe
  async resetPassword(token: string, newPassword: string) {
    const user = await this.userRepo.findOne({
      where: { resetToken: token },
    });

    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw new UnauthorizedException('Token invalide ou expiré');
    }

    const hash = await bcrypt.hash(newPassword, 10);
    await this.userRepo.update(user.id, {
      password:          hash,
      resetToken:        null,
      resetTokenExpiry:  null,
    });

    return { message: 'Mot de passe réinitialisé avec succès' };
  }
}