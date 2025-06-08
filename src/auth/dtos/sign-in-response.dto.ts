import { ApiProperty } from '@nestjs/swagger';
import { ResponseUserDto } from 'src/user/dtos/response-user.dto';

export class SignInResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI...' })
  token: string;

  @ApiProperty({ type: ResponseUserDto })
  user: ResponseUserDto;
}
