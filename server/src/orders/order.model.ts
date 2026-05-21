import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from '../users/user.model';

export type OrderLineItem = {
  name: string;
  price: number;
  category?: string | null;
};

@Table({ tableName: 'orders' })
export class Order extends Model {
  declare id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare userId: number;

  @BelongsTo(() => User, { foreignKey: 'userId', targetKey: 'id' })
  declare user: User;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: false })
  declare total: number;

  @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'card' })
  declare paymentMethod: string;

  @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'pending' })
  declare status: string;

  @Column({ type: DataType.JSONB, allowNull: false, defaultValue: [] })
  declare items: OrderLineItem[];

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
