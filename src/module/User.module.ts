// src/modules/users.module.ts
import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../entity/User';
import { UsersController } from 'src/controller/UsersController';
import { UsersService } from 'src/service/UserService';
import { JwtAuthMiddleware } from 'src/middleware/Auth.middleware';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret_key',
      signOptions: { expiresIn: '1h' },
    })

],
  controllers: [UsersController],
  providers: [UsersService, JwtAuthMiddleware],
  exports: [UsersService],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthMiddleware)
  }
}
