// import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

//import { User } from '../../users/users.entity';
//import { UserRole } from '../../users/types/user-role.enum';

//@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
  //  @InjectRepository(User)
  //  private readonly userRepository: Repository<User>,
  ) {
    super({
    //  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  //async validate(payload: any): Promise<User> {
    //const { email, sub: id, role } = payload;

  //  const user = await this.userRepository.findOne({
    //  where: { id, email, isActive: true },
   //   select: ['id', 'email', 'firstName', 'lastName', 'role', 'isActive'],
   // });
//
   // if (!user) {
   //   throw new UnauthorizedException('Invalid token');
    }

   // return {
     // ...user,
     //role: role as UserRole,
   // };
  ///}
//}
