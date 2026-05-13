import { Module } from '@nestjs/common';
import { IslamicController } from './islamic.controller';
import { IslamicService } from './islamic.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Islamic } from './islamic.model';

@Module({
  imports: [SequelizeModule.forFeature([Islamic])],
  controllers: [IslamicController],
  providers: [IslamicService],
})
export class IslamicModule {}
