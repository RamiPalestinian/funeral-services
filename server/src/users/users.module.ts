import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersController } from './users.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [SequelizeModule.forFeature([User]), forwardRef(() => AuthModule)],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
