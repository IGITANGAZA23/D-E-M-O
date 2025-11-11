import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { BorrowRecordsService } from './borrow-records.service';
import { BorrowBookDto } from './dto/borrow-book.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/guards/roles.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('borrow-records')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BorrowRecordsController {
  constructor(private readonly borrowRecordsService: BorrowRecordsService) {}

  @Post('borrow')
  @Roles(Role.User)
  async borrowBook(
    @Body() borrowBookDto: BorrowBookDto,
    @GetUser() user: any,
  ) {
    return this.borrowRecordsService.borrowBook(user.userId, borrowBookDto);
  }

  @Post('return/:bookId')
  @Roles(Role.User)
  async returnBook(@Param('bookId') bookId: string, @GetUser() user: any) {
    return this.borrowRecordsService.returnBook(user.userId, +bookId);
  }

  @Get('my-books')
  @Roles(Role.User)
  async getMyBorrowedBooks(@GetUser() user: any) {
    return this.borrowRecordsService.getUserBorrowedBooks(user.userId);
  }

  @Get('my-history')
  @Roles(Role.User)
  async getMyBorrowHistory(@GetUser() user: any) {
    return this.borrowRecordsService.getUserBorrowHistory(user.userId);
  }

  @Get('all')
  @Roles(Role.Librarian)
  async getAllBorrowRecords() {
    return this.borrowRecordsService.getAllBorrowRecords();
  }
}

