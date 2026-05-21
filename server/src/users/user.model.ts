import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  HasMany,
} from 'sequelize-typescript';
import { Service } from '../services/services.model';
import { Islamic } from 'src/islamic/islamic.model';
import { ClassicService } from 'src/classic-service/classicService.model';
import { Cremation } from 'src/cremations/cremations.model';
import { Card } from 'src/card/card.model';
import { Order } from 'src/orders/order.model';

@Table({ tableName: 'users' }) //декоратор - мы добавляем либо методанные либо функционал
export class User extends Model {
  declare id: number;

  // устанавливаем взаимосвязь

  @HasMany(() => Service, { foreignKey: 'userId' })
  declare services: Service[]; // магазин

  @HasMany(() => Islamic, { foreignKey: 'userId' })
  declare islamics: Islamic[];

  @HasMany(() => ClassicService, { foreignKey: 'userId' })
  declare classicServices: ClassicService[]; //классические похороны

  @HasMany(() => Cremation, { foreignKey: 'userId' })
  declare cremations: Cremation[];

  @HasMany(() => Card, { foreignKey: 'userId' })
  declare cards: Card[];

  @HasMany(() => Order, { foreignKey: 'userId' })
  declare orders: Order[];

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare avatar: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare lastName: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare middleName: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare phone: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare address: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare city: string | null;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
