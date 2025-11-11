import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book, BookStatus } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const book = this.bookRepository.create({
      ...createBookDto,
      status: createBookDto.status || BookStatus.AVAILABLE,
    });

    return await this.bookRepository.save(book);
  }

  async findAll(): Promise<Book[]> {
    return await this.bookRepository.find({
      relations: ['borrowRecords'],
    });
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: ['borrowRecords'],
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.findOne(id);
    Object.assign(book, updateBookDto);
    return await this.bookRepository.save(book);
  }

  async remove(id: number): Promise<void> {
    const book = await this.findOne(id);
    
    // Check if book is currently borrowed
    if (book.status === BookStatus.BORROWED) {
      throw new BadRequestException('Cannot delete a book that is currently borrowed');
    }

    await this.bookRepository.remove(book);
  }

  async updateStatus(id: number, status: BookStatus): Promise<Book> {
    const book = await this.findOne(id);
    book.status = status;
    return await this.bookRepository.save(book);
  }
}
