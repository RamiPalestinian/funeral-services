import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ServicesModule } from './services/services.module';
import { IslamicModule } from './islamic/islamic.module';
import { ClassicServiceModule } from './classic-service/classic-service.module';
import { CremationsModule } from './cremations/cremations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SequelizeModule.forRootAsync({
      inject: [ConfigService], // что бы мог пользоваться нашей переменной окружения
      //как именно мы подключаем наш модуль секвалайза
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get('DB_HOST'),
        port: Number(configService.get('DB_PORT')),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),

        autoLoadModels: true,
        synchronize: false, // что бы не сенхронизировался с миграциями
        logging: false, //что бы логгировал запросы
      }),
    }),
    UsersModule,
    AuthModule,
    ServicesModule,
    IslamicModule,
    ClassicServiceModule,
    CremationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
