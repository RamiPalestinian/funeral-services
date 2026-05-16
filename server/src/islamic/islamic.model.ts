import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
  HasMany,
} from 'sequelize-typescript';

import { User } from '../users/user.model';
import { Card } from '../card/card.model';

@Table({ tableName: 'islamic' })
export class Islamic extends Model<Islamic> {
  @HasMany(() => Card, { foreignKey: 'islamicId' })
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
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'userId' })
  declare userId: number;

  // привязка
  @BelongsTo(() => User, { foreignKey: 'userId' })
  declare user?: User;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
