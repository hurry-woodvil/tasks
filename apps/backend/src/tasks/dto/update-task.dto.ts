import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsIn(['todo', 'done'])
  status!: 'todo' | 'done';

  @IsOptional()
  @IsString()
  dueDate!: string | null;
}
