import { IsString, IsNotEmpty, IsEmail, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
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

  @IsNotEmpty()
  @IsString()
  role: 'USER';
}
