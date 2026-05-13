import { Module } from '@nestjs/common';
import { ClassicServiceController } from './classic-service.controller';
import { ClassicServiceService } from './classic-service.service';
import { ClassicService } from './classicService.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([ClassicService])], //пишем для инпорта через SequelizeModule наш Task из './task.model';
  controllers: [ClassicServiceController],
  providers: [ClassicServiceService],
})
export class ClassicServiceModule {}
