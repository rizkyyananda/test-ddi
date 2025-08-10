// src/users/dto/create-user.dto.ts
import { IsEmail, IsNotEmpty, Length, IsEnum } from 'class-validator';
import { UserRole } from '../../shared/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'johndoe',
    description: 'Unique username for the user',
    minLength: 3,
    maxLength: 20,
  })
  @IsNotEmpty()
  @Length(3, 20)
  username: string;

  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'Valid email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'StrongPassword123',
    description: 'Password for the account',
    minLength: 6,
    maxLength: 100,
  })
  @IsNotEmpty()
  @Length(6, 100)
  password: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.USER,
    description: 'Role assigned to the user',
    default: UserRole.USER,
  })
  @IsEnum(UserRole)
  role: UserRole = UserRole.USER;
}