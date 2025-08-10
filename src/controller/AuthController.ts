import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../service/AuthService';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from '../dto/login/LoginDTO';
import { successResponse } from 'src/handler/response-success-handller';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login User' })
  @ApiResponse({ status: 200, description: 'Berhasil login, mengembalikan JWT token' })
  @ApiResponse({ status: 401, description: 'Username atau password salah' })
  async login(@Body() loginDto: LoginDto) {
    try{
        const user = await this.authService.validateUser(loginDto.username, loginDto.password);
        if (!user) {
        throw new UnauthorizedException();
        }
        return successResponse( await this.authService.login(user)) 
    }catch(err){
        throw err;
    }
  }
}