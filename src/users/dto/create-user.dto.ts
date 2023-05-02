import { IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNumber()
  readonly id: number;

  @IsString()
  readonly email: string;

  @IsString()
  readonly first_name: string;

  @IsString()
  readonly last_name: string;

  @IsString()
  readonly avatar: string;
}
