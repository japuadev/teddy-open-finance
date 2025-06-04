import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUrlDto {
  @IsString()
  @IsNotEmpty()
  originalUrl: string;

  @IsString()
  @IsNotEmpty()
  shortener_url: string;

  @IsString()
  @IsOptional()
  ownerId: string;
}
