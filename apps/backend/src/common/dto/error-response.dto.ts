import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    example: 404,
  })
  statusCode!: number;

  @ApiProperty({
    example: 'NOT_FOUND',
  })
  code!: string;

  @ApiProperty({
    example: 'User not found',
  })
  message!: string;

  @ApiProperty({
    example: '2026-07-13T10:00:00.000Z',
  })
  timestamp!: string;

  @ApiProperty({
    example: '/auth/me',
  })
  path!: string;
}
