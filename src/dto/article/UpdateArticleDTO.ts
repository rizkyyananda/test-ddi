import { PartialType } from '@nestjs/mapped-types';
import { CreateArticleDto } from './CreateArticleDTO';
import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateArticleDto extends PartialType(CreateArticleDto) {
  @ApiPropertyOptional({
    description: 'Judul artikel',
    example: 'Test DDI NestJS',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'Konten artikel',
    example: 'Test DDI NestJS adalah sebuah framework yang...',
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    description: 'Status publikasi artikel',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  published?: boolean;

  @ApiPropertyOptional({
    description: 'Slug unik artikel',
    example: 'test-ddi-nestjs',
  })
  @IsString()
  @IsOptional()
  slug?: string;
}
