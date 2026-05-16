import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';

import { User } from '../users/user.model';
import { Card } from '../card/card.model';

@Table({ tableName: 'services' })
export class Service extends Model {
  @HasMany(() => Card, { foreignKey: 'serviceId' })
  declare cards: Card[];

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare description: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare price: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare image: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare category: string;

  //ForeignKey
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare userId: number;

  //привязка
  @BelongsTo(() => User, { foreignKey: 'userId', targetKey: 'id' })
  declare user: User;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
