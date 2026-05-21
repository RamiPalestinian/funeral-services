import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { AdminGuard } from './admin.guard';
import { ADMIN_USER_ID } from '../../common/constants/admin';

describe('AdminGuard', () => {
  const guard = new AdminGuard();

  const createContext = (userId?: number): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({
          user:
            userId === undefined ? undefined : { userId, email: 'u@test.ru' },
        }),
      }),
    }) as ExecutionContext;

  it('allows admin user', () => {
    expect(guard.canActivate(createContext(ADMIN_USER_ID))).toBe(true);
  });

  it('rejects non-admin user', () => {
    expect(() => guard.canActivate(createContext(2))).toThrow(
      ForbiddenException,
    );
    expect(() => guard.canActivate(createContext(2))).toThrow(
      'Доступ только для администратора',
    );
  });

  it('rejects when user is missing', () => {
    expect(() => guard.canActivate(createContext())).toThrow(
      ForbiddenException,
    );
  });
});
