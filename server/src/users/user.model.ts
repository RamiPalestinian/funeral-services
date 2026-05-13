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
import { Cremation } from 'src/cremations/cremations.model';

@Table({ tableName: 'users' }) //декоратор - мы добавляем либо методанные либо функционал
export class User extends Model {
  // устанавливаем взаимосвязь

  @HasMany(() => Service, { foreignKey: 'userId' })
  declare services: Service[];

  @HasMany(() => Cremation, { foreignKey: 'userId' })
  declare cremations: Cremation[];

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

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
