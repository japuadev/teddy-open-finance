import { ApiProperty } from '@nestjs/swagger';
export class UrlResponseDto {
  @ApiProperty({ example: 'd9e1bb38-28d4-4cfa-8a10-87c95a9ed241' })
  id?: string;

  @ApiProperty({ example: 'https://teddy360.com.br/assessor-de-investimento' })
  original_url?: string;

  @ApiProperty({ example: 'https://teddy360.com.br/Akl8' })
  shortener_url?: string;

  @ApiProperty({ example: 100 })
  accesses_qty?: number;
}
