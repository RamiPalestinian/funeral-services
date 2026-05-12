import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { Request, Response } from 'express';

const cookieConfig = {
  httpOnly: true, // что бы кук не работали через js и только чрез http
  secure: false, // for development environment
  maxAge: 1000 * 60 * 60 * 24 * 7,
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, ...rest } = await this.authService.register(dto);

    res.cookie('refreshToken', refreshToken, cookieConfig);

    return rest;
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, ...rest } = await this.authService.login(dto);

    res.cookie('refreshToken', refreshToken, cookieConfig);

    return rest;
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken');

    return { message: 'Успешный выход' };
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Необходим refresh-токен'); //пользователь не авторизован
    }

    const { refreshToken: newRefreshToken, ...rest } =
      await this.authService.refresh(refreshToken);

    res.cookie('refreshToken', newRefreshToken, cookieConfig);

    return rest;
  }
  //добавляем на п. 31
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: Request) {
    return req.user;
  }
}
