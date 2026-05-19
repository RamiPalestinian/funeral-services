import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  // вспомогательная функция для создания токенов
  private async signTokens(user: { id: number; email: string }) {
    const payload = { sub: user.id, email: user.email };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.getOrThrow('JWT_ACCESS_EXPIRES_IN'),
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.getOrThrow('JWT_REFRESH_EXPIRES_IN'),
    });

    return { accessToken, refreshToken };
  }

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase().trim();

    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.usersService.createUser({
      name: dto.name.trim(),
      email,
      password: hashedPassword,
    });
    const { accessToken, refreshToken } = await this.signTokens({
      id: user.id,
      email: user.email,
    });

    return {
      message: 'Registration successful',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar ?? null,
        lastName: user.lastName ?? null,
        middleName: user.middleName ?? null,
        phone: user.phone ?? null,
        address: user.address ?? null,
        city: user.city ?? null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  async login(dto: LoginDto) {
    const email = dto.email.toLowerCase().trim();

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const { accessToken, refreshToken } = await this.signTokens({
      id: user.id,
      email: user.email,
    });

    return {
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar ?? null,
        lastName: user.lastName ?? null,
        middleName: user.middleName ?? null,
        phone: user.phone ?? null,
        address: user.address ?? null,
        city: user.city ?? null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  async refresh(refreshToken: string) {
    let payload: { sub: number; email: string };

    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const userId = payload.sub;
    const user = await this.usersService.findUserById(userId);

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await this.signTokens({ id: user.id, email: user.email });

    return {
      message: 'Refresh successful',
      accessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar ?? null,
        lastName: user.lastName ?? null,
        middleName: user.middleName ?? null,
        phone: user.phone ?? null,
        address: user.address ?? null,
        city: user.city ?? null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }
}
