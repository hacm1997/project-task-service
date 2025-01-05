import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.APP_JWT_SECRET_KEY,
    });
  }

  // Valida el payload de JWT y devuelve los datos que estarán disponibles en el request.user
  async validate(payload: {
    id: string;
    name: string;
    email: string;
    role: string;
    // password: string;
    details: JSON | object;
  }) {
    return {
      userId: payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      //   password: payload.password,
      details: payload.details,
    };
  }
}
