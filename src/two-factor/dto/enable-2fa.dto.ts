import { IsString, IsNotEmpty, Length } from 'class-validator';

export class EnableTwoFactorDto {
  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: '2FA token must be 6 digits' })
  token: string;
}

