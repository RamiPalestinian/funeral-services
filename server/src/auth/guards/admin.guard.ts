import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { Request } from 'express';
import { ADMIN_USER_ID } from 'src/common/constants/admin';

type JwtRequestUser = { userId: number; email: string };

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context
      .switchToHttp()
      .getRequest<Request & { user: JwtRequestUser }>();

    if (req.user?.userId !== ADMIN_USER_ID) {
      throw new ForbiddenException('Доступ только для администратора');
    }

    return true;
  }
}
