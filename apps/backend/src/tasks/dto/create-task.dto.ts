import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Angularを学ぶ',
    description: 'タスク名',
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({
    example: '2026-07-10',
    description: '期限日',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  dueDate!: string | null;
}
