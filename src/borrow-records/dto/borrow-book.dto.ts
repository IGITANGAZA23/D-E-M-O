import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class BorrowBookDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  bookId: number;
}
