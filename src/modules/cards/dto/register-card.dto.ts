import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterCardDto {
  @IsString()
  @IsNotEmpty()
  card_id: string;

  @IsString()
  @IsNotEmpty()
  pin: string;
}

