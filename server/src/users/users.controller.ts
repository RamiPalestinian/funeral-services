import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Patch,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

type JwtRequestUser = { userId: number; email: string };

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('me')
  updateProfile(
    @Body() dto: UpdateUserDto,
    @Req() req: Request & { user: JwtRequestUser },
  ) {
    return this.usersService.updateProfile(req.user.userId, dto.name);
  }

  @Patch('me/password')
  @HttpCode(HttpStatus.OK)
  changePassword(
    @Body() dto: ChangePasswordDto,
    @Req() req: Request & { user: JwtRequestUser },
  ) {
    return this.usersService.changePassword(
      req.user.userId,
      dto.currentPassword,
      dto.newPassword,
    );
  }

  @Delete('me')
  @HttpCode(HttpStatus.OK)
  deleteAccount(
    @Req() req: Request & { user: JwtRequestUser },
    @Res({ passthrough: true }) res: Response,
  ) {
    res.clearCookie('refreshToken');
    return this.usersService.deleteAccount(req.user.userId);
  }
}
