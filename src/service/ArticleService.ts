import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';
import { CreateArticleDto } from 'src/dto/article/CreateArticleDTO';
import { UpdateArticleDto } from 'src/dto/article/UpdateArticleDTO';
import { PaginationDTO } from 'src/dto/PaginationDTO';
import { Article } from 'src/entity/Article';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article)
    private readonly articleModel: typeof Article,
  ) {}

  async create(createArticleDto: CreateArticleDto, userId: number) {
    try {
        const article = {
        ...createArticleDto,
        authorId: userId,
        }
        return await this.articleModel.create(article);
    }catch (error) {
      console.error('Error creating article:', error);
      throw error;
    }
  }

  async findAll(paginationDto: PaginationDTO) {
    const { page = 1, limit = 10, search } = paginationDto;
    const offset = (page - 1) * limit;

    const where: WhereOptions<Article> = {};

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await this.articleModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      data: rows,
      meta: {
        totalItems: count,
        currentPage: page,
        itemsPerPage: limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async findOne(id: number): Promise<Article> {
    const article = await this.articleModel.findByPk(id);

    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }

    return article;
  }

  async findByArticleName(articleName: string) {
    const article = await this.articleModel.findOne({
      where: { articleName },
    });

    if (!article) {
      throw new NotFoundException(
        `Article with name "${articleName}" not found`,
      );
    }

    return article;
  }

  async update(id: number, updateArticleDto: UpdateArticleDto, userId: number) {
    const article = await this.findOne(id);
    const articleData = {
      ...updateArticleDto,
      authorId: userId,
    };
    return await article.update(articleData);
  }

  async remove(id: number, userId: number) {
    const article = (await this.findOne(id)).toJSON();
    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }

    if (article.authorId !== userId) {
      throw new UnauthorizedException('You do not have permission to delete this article');
    }
    await this.articleModel.destroy({
      where: { id },
    });
    return { message: `Article with ID ${id} deleted successfully` };
  }
}
