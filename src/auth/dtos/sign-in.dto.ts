import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @IsEmail({}, { message: 'E-mail inválido.' })
  @IsNotEmpty({ message: 'O campo de e-mail é obrigatório.' })
  @ApiProperty({ example: 'joao@teddy360.com.br' })
  email: string;

  @IsString({ message: 'A senha deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo de senha é obrigatório.' })
  @ApiProperty({ example: 'adivinha360' })
  password: string;
}
