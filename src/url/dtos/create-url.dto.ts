import { IsNotEmpty, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUrlDto {
  @IsUrl({}, { message: 'A URL informada é inválida.' })
  @IsNotEmpty({ message: 'A URL original é obrigatória.' })
  @ApiProperty({
    example: 'https://teddy360.com.br/teste',
    description: 'Endereço original que será encurtado.',
  })
  original_url: string;
}
