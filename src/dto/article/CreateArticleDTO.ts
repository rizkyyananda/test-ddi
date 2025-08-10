import { IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateArticleDto {
  @ApiProperty({
    description: 'Judul artikel',
    example: 'Test DDI NestJS',
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Konten artikel',
    example: 'Ini adalah isi dari artikel test DDI NestJS',
  })
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({
    description: 'Status publikasi artikel',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  published?: boolean = false;
}