import { IsNotEmpty, IsOptional, IsUrl, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUrlDto {
  @IsUrl()
  @IsNotEmpty()
  @ApiProperty({ example: 'https://teddy360.com.br/teste' })
  original_url: string;

  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional({ example: '73e23517...' })
  owner_id?: string;
}
