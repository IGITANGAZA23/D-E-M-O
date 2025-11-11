import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Librarian } from './entities/librarian.entity';
import { CreateLibrarianDto } from './dto/create-librarian.dto';
import { UpdateLibrarianDto } from './dto/update-librarian.dto';

@Injectable()
export class LibrariansService {
  constructor(
    @InjectRepository(Librarian)
    private librarianRepository: Repository<Librarian>,
  ) {}

  async create(createLibrarianDto: CreateLibrarianDto): Promise<Librarian> {
    const existingLibrarian = await this.librarianRepository.findOne({
      where: { email: createLibrarianDto.email },
    });

    if (existingLibrarian) {
      throw new ConflictException('Librarian with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createLibrarianDto.password, 10);

    const librarian = this.librarianRepository.create({
      ...createLibrarianDto,
      password: hashedPassword,
    });

    return await this.librarianRepository.save(librarian);
  }

  async findAll(): Promise<Librarian[]> {
    return await this.librarianRepository.find({
      select: ['id', 'email', 'name', 'createdAt', 'updatedAt'],
    });
  }

  async findOne(id: number): Promise<Librarian> {
    const librarian = await this.librarianRepository.findOne({
      where: { id },
      select: ['id', 'email', 'name', 'createdAt', 'updatedAt'],
    });

    if (!librarian) {
      throw new NotFoundException(`Librarian with ID ${id} not found`);
    }

    return librarian;
  }

  async update(
    id: number,
    updateLibrarianDto: UpdateLibrarianDto,
  ): Promise<Librarian> {
    const librarian = await this.findOne(id);

    if (updateLibrarianDto.email && updateLibrarianDto.email !== librarian.email) {
      const existingLibrarian = await this.librarianRepository.findOne({
        where: { email: updateLibrarianDto.email },
      });

      if (existingLibrarian) {
        throw new ConflictException('Librarian with this email already exists');
      }
    }

    if (updateLibrarianDto.password) {
      updateLibrarianDto.password = await bcrypt.hash(
        updateLibrarianDto.password,
        10,
      );
    }

    Object.assign(librarian, updateLibrarianDto);
    return await this.librarianRepository.save(librarian);
  }

  async remove(id: number): Promise<void> {
    const librarian = await this.findOne(id);
    await this.librarianRepository.remove(librarian);
  }

  async findOneByEmail(email: string): Promise<Librarian | null> {
    return await this.librarianRepository.findOne({ where: { email } });
  }
}

