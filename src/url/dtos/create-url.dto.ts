import { IsNotEmpty, IsOptional, IsUrl, IsUUID } from 'class-validator';

export class CreateUrlDto {
  @IsUrl()
  @IsNotEmpty()
  original_url: string;

  @IsOptional()
  @IsUUID()
  owner_id?: string;

  @IsOptional()
  @IsUUID()
  previous_url_id?: string;
}
