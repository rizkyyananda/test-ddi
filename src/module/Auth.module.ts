import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '../service/AuthService';
import { AuthController } from '../controller/AuthController';
import { JwtStrategy } from '../shared/JWT.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './User.module';
import { ArticleModule } from './Article.module';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    PassportModule,
    ArticleModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'default_secret_key',
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}