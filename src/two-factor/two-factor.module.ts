import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TwoFactorService } from './two-factor.service';
import { TwoFactorController } from './two-factor.controller';
import { User } from '../users/entities/user.entity';
import { Librarian } from '../librarians/entities/librarian.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Librarian])],
  controllers: [TwoFactorController],
  providers: [TwoFactorService],
  exports: [TwoFactorService],
})
export class TwoFactorModule {}

