import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport'; // что бы взять за основу стратегии
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //jwt из запроса - из строки авторизации - из заголовка AuthHeader в котром Bearer*пробел*Token
      secretOrKey: config.getOrThrow('JWT_ACCESS_SECRET'),
    });
  }

  // проверяет что у нас в accestoken и возвращать [userId, email]
  validate(payload: { sub: number; email: string }) {
    return { userId: payload.sub, email: payload.email };
  }
}
