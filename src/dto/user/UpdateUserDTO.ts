// src/users/dto/update-user.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './CreateUserDTO';
import { IsOptional, IsEmail, Length, IsEnum } from 'class-validator';
import { UserRole } from '../../shared/user-role.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    example: 'janedoe',
    description: 'New username for the user (optional)',
    minLength: 3,
    maxLength: 20,
  })
  @IsOptional()
  @Length(3, 20)
  username?: string;

  @ApiPropertyOptional({
    example: 'janedoe@example.com',
    description: 'New email address (optional)',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: 'NewPassword123',
    description: 'New password for the account (optional)',
    minLength: 6,
    maxLength: 100,
  })
  @IsOptional()
  @Length(6, 100)
  password?: string;

  @ApiPropertyOptional({
    enum: UserRole,
    example: UserRole.ADMIN,
    description: 'New role for the user (optional)',
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}