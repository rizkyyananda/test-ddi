// src/users/users.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../service/UserService';
import { CreateUserDto } from '../dto/user/CreateUserDTO';
import { UpdateUserDto } from '../dto/user/UpdateUserDTO';
import { PaginationDTO } from '../dto/PaginationDTO';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/shared/jwt-auth.guard';
import { successResponse } from 'src/handler/response-success-handller';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth('access-token')
export class UsersController {
   constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  async create(@Body() createUserDto: CreateUserDto) {
    try {
        return successResponse(await this.usersService.create(createUserDto));
    }catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all users with pagination' })
  async findAll(@Query() paginationDto: PaginationDTO) {
    return successResponse(await this.usersService.findAll(paginationDto));
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: number) {
    try {
      return successResponse(await this.usersService.findOne(id));
    }catch (error) {
      console.error('Error finding user:', error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('email/:email')
  @ApiOperation({ summary: 'Get user by email' })
  async findByEmail(@Param('email') email: string) {
    try {
      const user = await this.usersService.findByEmail(email);
      return successResponse(user);
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update user' })
  async update(@Param('id') id: number,@Body() updateUserDto: UpdateUserDto,) {
    try{
      return successResponse(await this.usersService.update(id, updateUserDto));
    }catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  async remove(@Param('id') id: number) {
    try {
      await this.usersService.remove(id);
      return successResponse('User successfully deleted');
    }catch (error) {
      console.error('Error removing user:', error);
      throw error;
    }
  }
}