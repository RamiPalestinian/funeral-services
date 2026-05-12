import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

//расширяет наш обычный AuthGuard и с его помощью можем закрывать другие endpoints
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
