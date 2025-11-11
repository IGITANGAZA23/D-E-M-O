import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateLibrarianDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

