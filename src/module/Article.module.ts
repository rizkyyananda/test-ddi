// src/modules/users.module.ts
import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../entity/User';
import { UsersController } from 'src/controller/UsersController';
import { UsersService } from 'src/service/UserService';
import { JwtAuthMiddleware } from 'src/middleware/Auth.middleware';
import { JwtModule } from '@nestjs/jwt';
import { ArticleController } from 'src/controller/ArticleController';
import { ArticleService } from 'src/service/ArticleService';
import { Article } from 'src/entity/Article';

@Module({
  imports: [
    SequelizeModule.forFeature([Article]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret_key',
      signOptions: { expiresIn: '1h' },
    })

],
  controllers: [ArticleController],
  providers: [ArticleService, JwtAuthMiddleware],
  exports: [ArticleService],
})
export class ArticleModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthMiddleware)
  }
}