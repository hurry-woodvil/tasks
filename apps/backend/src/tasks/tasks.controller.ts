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

@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Get()
  findAll(): Task[] {
    console.log('Find All');
    return this.taskService.findAll();
  }

  @Post()
  create(@Body() task: Task): Task {
    console.log('Create');
    return this.taskService.create(task);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() task: Task): Task {
    console.log('Update');
    return this.taskService.update({ ...task, id });
  }

  @Delete(':id')
  delete(@Param('id') id: string): void {
    console.log('Delete');
    return this.taskService.delete(id);
  }
}
