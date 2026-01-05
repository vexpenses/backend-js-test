import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterAccountDto {
  @IsString()
  @IsNotEmpty()
  account_id: string;

  @IsString()
  @IsNotEmpty()
  pin: string;
}

