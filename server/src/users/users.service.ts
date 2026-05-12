import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';

type CreateUserPayload = {
  name: string;
  email: string;
  password: string;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) // ← Декоратор: говорит NestJS, что нужно внедрить
    private readonly userModel: typeof User, // ← Свойство класса: тип - модель User
  ) {}

  //создание пользователя
  async createUser(payload: CreateUserPayload) {
    return this.userModel.create(payload); // this- к UserService
  }

  //поиск пользователя
  async findByEmail(email: string) {
    return this.userModel.findOne({ where: { email } });
  }

  //поиск пользователя по ИД
  async findUserById(id: number) {
    return this.userModel.findByPk(id);
  }
}
