import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto {
  @ApiProperty({
    example: 'Angular Signalsを学ぶ',
    description: 'タスク名',
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    enum: ['todo', 'done'],
    example: 'done',
    description: 'タスクの状態',
  })
  @IsIn(['todo', 'done'])
  status!: 'todo' | 'done';

  @ApiPropertyOptional({
    example: '2026-07-10',
    description: '期限日',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  dueDate!: string | null;
}
