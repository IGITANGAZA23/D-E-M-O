import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BorrowRecord, BorrowStatus } from './entities/borrow-record.entity';
import { Book, BookStatus } from '../books/entities/book.entity';
import { User } from '../users/entities/user.entity';
import { BorrowBookDto } from './dto/borrow-book.dto';

@Injectable()
export class BorrowRecordsService {
  constructor(
    @InjectRepository(BorrowRecord)
    private borrowRecordRepository: Repository<BorrowRecord>,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async borrowBook(userId: number, borrowBookDto: BorrowBookDto) {
    const book = await this.bookRepository.findOne({
      where: { id: borrowBookDto.bookId },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${borrowBookDto.bookId} not found`);
    }

    if (book.status === BookStatus.BORROWED) {
      throw new BadRequestException('Book is already borrowed');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Check if user has any active borrows for this book
    const activeBorrow = await this.borrowRecordRepository.findOne({
      where: {
        userId,
        bookId: borrowBookDto.bookId,
        status: BorrowStatus.BORROWED,
      },
    });

    if (activeBorrow) {
      throw new BadRequestException('You have already borrowed this book');
    }

    // Create borrow record
    const borrowRecord = this.borrowRecordRepository.create({
      userId,
      bookId: borrowBookDto.bookId,
      status: BorrowStatus.BORROWED,
      borrowDate: new Date(),
    });

    // Update book status
    book.status = BookStatus.BORROWED;
    await this.bookRepository.save(book);

    return await this.borrowRecordRepository.save(borrowRecord);
  }

  async returnBook(userId: number, bookId: number) {
    const borrowRecord = await this.borrowRecordRepository.findOne({
      where: {
        userId,
        bookId,
        status: BorrowStatus.BORROWED,
      },
      relations: ['book'],
    });

    if (!borrowRecord) {
      throw new NotFoundException(
        'No active borrow record found for this book',
      );
    }

    // Update borrow record
    borrowRecord.status = BorrowStatus.RETURNED;
    borrowRecord.returnDate = new Date();
    await this.borrowRecordRepository.save(borrowRecord);

    // Update book status
    const book = borrowRecord.book;
    book.status = BookStatus.AVAILABLE;
    await this.bookRepository.save(book);

    return borrowRecord;
  }

  async getUserBorrowedBooks(userId: number) {
    return await this.borrowRecordRepository.find({
      where: {
        userId,
        status: BorrowStatus.BORROWED,
      },
      relations: ['book'],
    });
  }

  async getUserBorrowHistory(userId: number) {
    return await this.borrowRecordRepository.find({
      where: { userId },
      relations: ['book'],
      order: { createdAt: 'DESC' },
    });
  }

  async getAllBorrowRecords() {
    return await this.borrowRecordRepository.find({
      relations: ['book', 'user'],
      order: { createdAt: 'DESC' },
    });
  }
}

