import { IsString, IsNotEmpty, IsEmail, MinLength, MaxLength, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'joao@teddy360.com.br' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, {
    message: 'Senha esta muito curta. Tamanho mínimo é de $constraint1 caracteres.',
  })
  @MaxLength(8, {
    message: 'Senha esta muito longa. Tamanho máximo é $constraint1 caracteres.',
  })
  @ApiProperty({
    example: 'adivinha',
    description: 'Senha do usuário (mín. 6, máx. 8 caracteres)',
    minLength: 6,
    maxLength: 8,
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'João Melo' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['USER', 'ADMIN'])
  @ApiProperty({
    enum: ['USER', 'ADMIN'],
    description: 'Tipo de acesso do usuário.',
    default: 'USER',
  })
  role: 'USER';
}
