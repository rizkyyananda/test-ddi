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
          [Op.or]: [{ email }, { username }]
        }
      });

      if (exists) {
        throw new Error('DUPLICATE_EMAIL_OR_USERNAME');
      }

      return await this.userModel.create({
        ...createUserDto,
        password: createUserDto.password 
      });

    } catch (error) {
      console.error('Error creating user:', error);

      // cek jika error dari validasi duplicate email/username
      if (error.message === 'DUPLICATE_EMAIL_OR_USERNAME') {
        throw new ConflictException('email or username already exists');
      }

      // cek jika error dari unique constraint DB
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new ConflictException('email or username already exists');
      }
      throw new InternalServerErrorException('Failed to create user');
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
      data: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userModel.findByPk(id, {
    //   include: ['articles']
    });

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
    const user = await this.findOne(id);
    return user.update(updateUserDto);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    return user.destroy();
  }
}