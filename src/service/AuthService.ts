// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/service/UserService';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findByUsername(username);
        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
            return null;
        }
    async login(user: any) {
        const userId = user.dataValues.id
        const username = user.dataValues.username;

        if (!userId && !username) {
            throw new Error('User data incomplete, cannot generate token');
        }

        const payload = {
            sub: userId,
            username: username,
        };

    return {
            access_token: this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET || 'default_secret_key',
            expiresIn: '1h',
            }),
        };
    }

}
