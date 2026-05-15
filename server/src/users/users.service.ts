import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
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

  private toSafeUser(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async updateProfile(id: number, name: string) {
    const user = await this.findUserById(id);

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    await user.update({ name: name.trim() });

    return { user: this.toSafeUser(user) };
  }

  async changePassword(
    id: number,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.findUserById(id);

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный текущий пароль');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    return { message: 'Пароль успешно изменён' };
  }
}
