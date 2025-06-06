import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsOptional, IsEmail, MinLength, MaxLength, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional({ example: 'joao@teddy360.com.br' })
  email: string;

  @IsString()
  @IsOptional()
  @MinLength(6, {
    message: 'Senha esta muito curta. Tamanho mínimo é de $constraint1 caracteres.',
  })
  @MaxLength(8, {
    message: 'Senha esta muito longa. Tamanho máximo é $constraint1 caracteres.',
  })
  @ApiPropertyOptional({
    example: 'adivinha',
    description: 'Senha do usuário (mín. 6, máx. 8 caracteres)',
    minLength: 6,
    maxLength: 8,
  })
  password: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'João Melo' })
  name: string;

  @IsOptional()
  @IsString()
  @IsIn(['USER', 'ADMIN'])
  @ApiPropertyOptional({
    enum: ['USER', 'ADMIN'],
    description: 'Tipo de acesso do usuário.',
    default: 'USER',
  })
  role: 'USER';
}
