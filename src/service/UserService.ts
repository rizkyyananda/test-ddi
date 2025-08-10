import { Injectable, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/entity/User';
import { CreateUserDto } from '../dto/user/CreateUserDTO';
import { UpdateUserDto } from '../dto/user/UpdateUserDTO';
import { PaginationDTO } from '../dto/PaginationDTO';
import { WhereOptions, Op } from 'sequelize';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { email, username } = createUserDto;

      const exists = await this.userModel.findOne({
        where: {
          [Op.or]: [{ email }, { username }],
          deleted_at: null,
        },
      });

      if (exists){
        throw new ConflictException(`username or email already exist`);
      }

      return await this.userModel.create({
        ...createUserDto,
        password: createUserDto.password 
      });

    } catch (error) {
      console.error('Error created email:', error);
      throw error;
    }
  }


  async findAll(paginationDto: PaginationDTO) {
    const { page = 1, limit = 10, search } = paginationDto;
    const where: WhereOptions<User> = {};

    if (search) {
      where[Op.or] = [
        { username: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows } = await this.userModel.findAndCountAll({
      where,
      limit,
      offset: (page - 1) * limit,
    //   include: ['articles'], // Untuk relasi
      order: [['createdAt', 'DESC']]
    });

    return {
      content: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async findOne(id: number) {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }


  async findByUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({
      where: { username }
    } );

    if (!user) {
      throw new NotFoundException(`User with ID ${username} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ 
      where: { email }
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.findOne(id);
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user.update(updateUserDto);

    }catch (error) {
      throw error
    }
  }

  async remove(id: number) {
    try {
      const user = await this.findOne(id);
      return await this.userModel.destroy(user ? { where: { id } } : {})
    }catch (error) {
      throw error;
    }
  }
}