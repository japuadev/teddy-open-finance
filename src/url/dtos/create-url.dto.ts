import { IsNotEmpty, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUrlDto {
  @IsUrl()
  @IsNotEmpty()
  @ApiProperty({ example: 'https://teddy360.com.br/teste' })
  original_url: string;
}
