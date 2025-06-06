import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsIn } from 'class-validator';

export class UrlQueryDto {
  @ApiPropertyOptional({
    enum: ['me', 'other', 'both'],
    description: 'Tipo de escopo de URLs (meu, outros e ambos)',
    default: 'me',
  })
  @IsOptional()
  @IsIn(['me', 'other', 'both'])
  type: 'me' | 'other' | 'both';

  @ApiPropertyOptional({
    description:
      'Filtra URLs desativadas. Associadas ao deleted_at != null estão deletadas. Quando estiverem apenas desativadas, foram atualizadas.',
    example: 'true',
  })
  @IsOptional()
  active?: string;

  @ApiPropertyOptional({
    description: 'Filtra URLs deletadas.',
    example: 'false',
  })
  @IsOptional()
  deleted?: string;
}
