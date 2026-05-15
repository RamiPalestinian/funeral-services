import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.model';
import { Card } from 'src/card/card.model';
import { Service } from 'src/services/services.model';
import { Islamic } from 'src/islamic/islamic.model';
import { ClassicService } from 'src/classic-service/classicService.model';
import { Cremation } from 'src/cremations/cremations.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersController } from './users.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Card,
      Service,
      Islamic,
      ClassicService,
      Cremation,
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
