// src/config/connection.ts
import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { User } from '../entity/User';
import { Article } from '../entity/Article';

export const sequelizeConfig: SequelizeModuleOptions = {
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'test_ddi',
  models: [User, Article],
  autoLoadModels: true,
  synchronize: process.env.NODE_ENV !== 'production',
  define: {
    paranoid: true,
    timestamps: true,
    underscored: true,
  }
};