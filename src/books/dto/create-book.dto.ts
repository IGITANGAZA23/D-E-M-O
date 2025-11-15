import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { BookStatus } from '../entities/book.entity';
import { ApiProperty } from '@nestjs/swagger';
export class CreateBookDto {
  @ApiProperty({ example: 'The Great Gatsby' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'F. Scott Fitzgerald' })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({ example: '789439848939' })
  @IsString()
  @IsNotEmpty()
  isbn: string;

  @ApiProperty({ example: 'available', enum: BookStatus, required: false })
  @IsOptional()
  @IsEnum(BookStatus)
  status?: BookStatus;
}
