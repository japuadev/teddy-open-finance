import { ApiProperty } from '@nestjs/swagger';

export class UrlResponseDto {
  @ApiProperty({ example: 'https://dominio.com/abc123' })
  shortener_url: string;
}
