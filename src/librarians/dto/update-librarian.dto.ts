import { PartialType } from '@nestjs/mapped-types';
import { CreateLibrarianDto } from './create-librarian.dto';

export class UpdateLibrarianDto extends PartialType(CreateLibrarianDto) {}

