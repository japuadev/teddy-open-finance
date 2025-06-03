/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, IsNotEmpty } from 'class-validator';

export class FindUserDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  @IsString()
  role: 'USER';
}
