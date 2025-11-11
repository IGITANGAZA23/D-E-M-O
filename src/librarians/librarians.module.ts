import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibrariansService } from './librarians.service';
import { LibrariansController } from './librarians.controller';
import { Librarian } from './entities/librarian.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Librarian])],
  controllers: [LibrariansController],
  providers: [LibrariansService],
  exports: [LibrariansService],
})
export class LibrariansModule {}

