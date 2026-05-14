import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  UpdatedAt,
  CreatedAt,
} from 'sequelize-typescript';

import { User } from '../users/user.model';
import { Service } from '../services/services.model';
import { Islamic } from '../islamic/islamic.model';
import { ClassicService } from '../classic-service/classicService.model';
import { Cremation } from '../cremations/cremations.model';

@Table({ tableName: 'cards' })
export class Card extends Model {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare userId: number;

  @BelongsTo(() => User, { foreignKey: 'userId', targetKey: 'id' })
  declare user: User;

  @ForeignKey(() => Service)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare serviceId: number | null;

  @BelongsTo(() => Service, { foreignKey: 'serviceId', targetKey: 'id' })
  declare service: Service;

  @ForeignKey(() => Islamic)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare islamicId: number | null;

  @BelongsTo(() => Islamic, { foreignKey: 'islamicId', targetKey: 'id' })
  declare islamic: Islamic;

  @ForeignKey(() => ClassicService)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare classicServiceId: number | null;

  @BelongsTo(() => ClassicService, {
    foreignKey: 'classicServiceId',
    targetKey: 'id',
  })
  declare classicService: ClassicService;

  @ForeignKey(() => Cremation)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare cremationId: number | null;

  @BelongsTo(() => Cremation, { foreignKey: 'cremationId', targetKey: 'id' })
  declare cremation: Cremation;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
