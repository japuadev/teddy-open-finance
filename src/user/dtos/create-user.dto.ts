import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  MaxLength,
  IsEnum,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @IsEmail({}, { message: 'E-mail inválido.' })
  @ApiProperty({ example: 'joao@teddy360.com.br' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, {
    message: 'Senha muito curta. Mínimo de $constraint1 caracteres.',
  })
  @MaxLength(12, {
    message: 'Senha muito longa. Máximo de $constraint1 caracteres.',
  })
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d).+$/, {
    message: 'A senha deve conter pelo menos uma letra e um número.',
  })
  @ApiProperty({
    example: 'adivinha360',
    description: 'Senha do usuário (mín. 6, máx. 8 caracteres, com letras e números)',
    minLength: 6,
    maxLength: 8,
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'João Melo' })
  name: string;

  @IsEnum(Role, { message: 'Permissão deve ser USER ou ADMIN' })
  @ApiProperty({
    enum: Role,
    description: 'Tipo de acesso do usuário.',
    default: Role.USER,
  })
  role: Role;
}
