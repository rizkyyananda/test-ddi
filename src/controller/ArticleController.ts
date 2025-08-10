import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateArticleDto } from "src/dto/article/CreateArticleDTO";
import { UpdateArticleDto } from "src/dto/article/UpdateArticleDTO";
import { PaginationDTO } from "src/dto/PaginationDTO";
import { ArticleService } from "src/service/ArticleService";
import { CurrentUser } from "src/shared/current-user.decorator";
import { JwtAuthGuard } from "src/shared/jwt-auth.guard";

@ApiTags('Articles')
@Controller('articles')
@ApiBearerAuth()
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}


    @UseGuards(JwtAuthGuard)
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create article' })
    @ApiResponse({ status: 201, description: 'Article successfully created' })
    async create(@Body() createArticleDto: CreateArticleDto, @CurrentUser() user: any) {
        try {
            const userId = user.userId;
            if (!userId) {
                throw new UnauthorizedException('User not authenticated');
            }
            return this.articleService.create(createArticleDto, userId); // Kirim ke service
        } catch (error) {
            console.error('Error creating article:', error);
            throw error;
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiOperation({ summary: 'Get all users with pagination' })
    async findAll(@Query() paginationDto: PaginationDTO) {
        return this.articleService.findAll(paginationDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    @ApiOperation({ summary: 'Get user by ID' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async findOne(@Param('id') id: number) {
        return this.articleService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    @ApiOperation({ summary: 'Update user' })
    async update(
    @Param('id') id: number,
    @Body() updateArticleDto: UpdateArticleDto, @CurrentUser() user: any) {
        const userId = user.userId;
        if (!userId) {
            throw new UnauthorizedException('User not authenticated');
        }
        return this.articleService.update(id, updateArticleDto, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @ApiOperation({ summary: 'Delete user' })
    async remove(@Param('id') id: number, @CurrentUser() user: any) {
        const userId = user.userId;
        if (!userId) {
            throw new UnauthorizedException('User not authenticated');
        }
        return this.articleService.remove(id, userId);
    }
}