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
  async findAll(): Promise<Task[]> {
    return await this.taskService.findAll();
  }

  @Post()
  async create(@Body() dto: CreateTaskDto): Promise<Task> {
    return await this.taskService.create(dto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ): Promise<Task> {
    return await this.taskService.update(id, dto);
  }

  @Delete()
  async deleteAll(): Promise<void> {
    return await this.taskService.deleteAll();
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.taskService.delete(id);
  }
}
