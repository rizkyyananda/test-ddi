import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateArticleDto } from "src/dto/article/CreateArticleDTO";
import { UpdateArticleDto } from "src/dto/article/UpdateArticleDTO";
import { PaginationDTO } from "src/dto/PaginationDTO";
import { successResponse } from "src/handler/response-success-handller";
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
            return successResponse(await this.articleService.create(createArticleDto, userId)) 
        } catch (error) {
            console.error('Error creating article:', error);
            throw error;
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiOperation({ summary: 'Get all users with pagination' })
    async findAll(@Query() paginationDto: PaginationDTO) {
        try {
            return successResponse(await this.articleService.findAll(paginationDto));
        }catch (error) {
            console.error('Error fetching articles:', error);
            throw error;
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    @ApiOperation({ summary: 'Get user by ID' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async findOne(@Param('id') id: number) {
        try {
            return successResponse(await this.articleService.findOne(id));
        } catch (error) {
            console.error('Error finding article:', error);
            throw error;
        }
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    @ApiOperation({ summary: 'Update user' })
    async update(@Param('id') id: number, @Body() updateArticleDto: UpdateArticleDto, @CurrentUser() user: any) {
        try {
            const userId = user.userId;
            console.log(userId, " user id ---")
            if (!userId) {
                throw new UnauthorizedException('User not authenticated');
            }
            return successResponse(await this.articleService.update(id, updateArticleDto, userId));
        } catch (error) {
            console.error('Error updating article:', error);
            throw error;
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @ApiOperation({ summary: 'Delete user' })
    async remove(@Param('id') id: number, @CurrentUser() user: any) {
        try {
            const userId = user.userId;
            if (!userId) {
                throw new UnauthorizedException('User not authenticated');
            }
            await this.articleService.remove(id, userId)
            return successResponse("delete article success")
        } catch (error) {
            console.error('Error removing user:', error);
            throw error;
        } 
        
    }
}