import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { BookStatus } from '../entities/book.entity';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsNotEmpty()
  isbn: string;

  @IsOptional()
  @IsEnum(BookStatus)
  status?: BookStatus;
}
