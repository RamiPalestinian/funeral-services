import { Module } from '@nestjs/common';
import { CremationsController } from './cremations.controller';
import { CremationsService } from './cremations.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Cremation } from './cremations.model';
@Module({
  imports: [SequelizeModule.forFeature([Cremation])],
  controllers: [CremationsController],
  providers: [CremationsService],
})
export class CremationsModule {}
