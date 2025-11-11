import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { LibrariansService } from './librarians.service';
import { CreateLibrarianDto } from './dto/create-librarian.dto';
import { UpdateLibrarianDto } from './dto/update-librarian.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/guards/roles.guard';

@Controller('librarians')
export class LibrariansController {
  constructor(private readonly librariansService: LibrariansService) {}

  @Post('setup')
  async setup(@Body() createLibrarianDto: CreateLibrarianDto) {
    // Allow creating first librarian without authentication
    return this.librariansService.create(createLibrarianDto);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Librarian)
  create(@Body() createLibrarianDto: CreateLibrarianDto) {
    return this.librariansService.create(createLibrarianDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Librarian)
  findAll() {
    return this.librariansService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Librarian)
  findOne(@Param('id') id: string) {
    return this.librariansService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Librarian)
  update(
    @Param('id') id: string,
    @Body() updateLibrarianDto: UpdateLibrarianDto,
  ) {
    return this.librariansService.update(+id, updateLibrarianDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Librarian)
  remove(@Param('id') id: string) {
    return this.librariansService.remove(+id);
  }
}

