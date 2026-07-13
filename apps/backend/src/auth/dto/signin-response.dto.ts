import { ApiProperty } from '@nestjs/swagger';

export class SigninResponseDto {
  @ApiProperty({
    description: 'JWT Access Token',
  })
  accessToken!: string;
}
