import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import type { Task } from './models/task';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Get()
  findAll(): Task[] {
    return this.taskService.findAll();
  }

  @Post()
  create(@Body() dto: CreateTaskDto): Task {
    return this.taskService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto): Task {
    return this.taskService.update(id, dto);
  }

  @Delete()
  deleteAll(): void {
    return this.taskService.deleteAll();
  }

  @Delete(':id')
  delete(@Param('id') id: string): void {
    return this.taskService.delete(id);
  }
}
