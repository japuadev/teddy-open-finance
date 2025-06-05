import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsOptional, IsEmail, MinLength, MaxLength } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsOptional()
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  @MinLength(6, {
    message: 'Pass is too short. Minimal length is $constraint1 characters.',
  })
  @MaxLength(8, {
    message: 'Pass is too long. Maximal length is $constraint1 characters.',
  })
  password: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  role: 'USER';
}
