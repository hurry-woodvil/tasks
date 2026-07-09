import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TaskDto {
  @ApiProperty({
    example: 'task-id',
  })
  id!: string;

  @ApiProperty({
    example: 'Angularを学ぶ',
  })
  title!: string;

  @ApiProperty({ enum: ['todo', 'done'], example: 'todo' })
  status!: 'todo' | 'done';

  @ApiPropertyOptional({ example: '2026-07-10', nullable: true })
  dueDate!: string | null;

  @ApiPropertyOptional({ example: '2026-07-01T00:00:00.000Z' })
  createdAt!: Date;

  @ApiPropertyOptional({ example: '2026-07-01T00:00:00.000Z' })
  updatedAt!: Date;
}
