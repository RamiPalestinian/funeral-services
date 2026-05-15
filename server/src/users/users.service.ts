import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { Card } from 'src/card/card.model';
import { ClassicService } from 'src/classic-service/classicService.model';
import { Cremation } from 'src/cremations/cremations.model';
import { Islamic } from 'src/islamic/islamic.model';
import { Service } from 'src/services/services.model';
import { User } from './user.model';

type CreateUserPayload = {
  name: string;
  email: string;
  password: string;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectModel(Card)
    private readonly cardModel: typeof Card,
    @InjectModel(Service)
    private readonly serviceModel: typeof Service,
    @InjectModel(Islamic)
    private readonly islamicModel: typeof Islamic,
    @InjectModel(ClassicService)
    private readonly classicServiceModel: typeof ClassicService,
    @InjectModel(Cremation)
    private readonly cremationModel: typeof Cremation,
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
      avatar: user.avatar,
      lastName: user.lastName,
      middleName: user.middleName,
      phone: user.phone,
      address: user.address,
      city: user.city,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async updateProfile(id: number, dto: UpdateUserDto) {
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    const patch: Partial<{
      name: string;
      avatar: string | null;
      email: string;
      lastName: string | null;
      middleName: string | null;
      phone: string | null;
      address: string | null;
      city: string | null;
    }> = {};
    if (dto.name !== undefined) {
      patch.name = dto.name.trim();
    }
    if (dto.email !== undefined) {
      const email = dto.email.toLowerCase().trim();
      const busy = await this.findByEmail(email);
      if (busy && busy.id !== id) {
        throw new ConflictException('Этот email уже используется');
      }
      patch.email = email;
    }

    if (dto.lastName !== undefined) {
      patch.lastName = dto.lastName.trim() || null;
    }
    if (dto.middleName !== undefined) {
      patch.middleName = dto.middleName.trim() || null;
    }
    if (dto.phone !== undefined) {
      patch.phone = dto.phone.trim() || null;
    }
    if (dto.address !== undefined) {
      patch.address = dto.address.trim() || null;
    }
    if (dto.city !== undefined) {
      patch.city = dto.city.trim() || null;
    }
    if (dto.avatar !== undefined) {
      patch.avatar = dto.avatar.trim();
    }
    if (Object.keys(patch).length > 0) {
      await user.update(patch);
    }
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

  async deleteAccount(id: number) {
    const user = await this.findUserById(id);

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    await this.cardModel.destroy({ where: { userId: id } });
    await this.serviceModel.destroy({ where: { userId: id } });
    await this.islamicModel.destroy({ where: { userId: id } });
    await this.classicServiceModel.destroy({ where: { userId: id } });
    await this.cremationModel.destroy({ where: { userId: id } });
    await user.destroy();

    return { message: 'Аккаунт удалён' };
  }
}
