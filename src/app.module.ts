// src/app.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { sequelizeConfig } from './config/connection';
import { UsersModule } from './module/User.module';
import { AuthModule } from './module/Auth.module';
import { ArticleModule } from './module/Article.module';

@Module({
  imports: [
    SequelizeModule.forRoot(sequelizeConfig),
    UsersModule,
    AuthModule,
    ArticleModule
  ],
})
export class AppModule {}