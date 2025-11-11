import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { UsersModule } from './users/users.module';
import { LibrariansModule } from './librarians/librarians.module';
import { AuthModule } from './auth/auth.module';
import { BorrowRecordsModule } from './borrow-records/borrow-records.module';
import { Book } from './books/entities/book.entity';
import { User } from './users/entities/user.entity';
import { Librarian } from './librarians/entities/librarian.entity';
import { BorrowRecord } from './borrow-records/entities/borrow-record.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'library_management',
      entities: [Book, User, Librarian, BorrowRecord],
      synchronize: process.env.NODE_ENV !== 'production', // Only for development
    }),
    BooksModule,
    UsersModule,
    LibrariansModule,
    AuthModule,
    BorrowRecordsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
