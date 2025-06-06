import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class SignInDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'joao@teddy360.com.br' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'adivinha' })
  password: string;
}
