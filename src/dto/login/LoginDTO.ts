import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'john_doe', description: 'Username pengguna' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'strongpassword123', description: 'Password pengguna' })
  @IsString()
  @IsNotEmpty()
  password: string;
}