import { IsInt, IsNotEmpty } from 'class-validator';

export class BorrowBookDto {
  @IsInt()
  @IsNotEmpty()
  bookId: number;
}

