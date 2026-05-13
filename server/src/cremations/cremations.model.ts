import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

import { User } from '../users/user.model';

@Table({ tableName: 'cremations' })
export class Cremation extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare description: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare price: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare image: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare category: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare status: string;

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
