/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class SignInDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  pass: string;
}
