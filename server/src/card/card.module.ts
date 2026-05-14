import { Module } from '@nestjs/common';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { Card } from './card.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([Card])],
  controllers: [CardController],
  providers: [CardService],
})
export class CardModule {}
