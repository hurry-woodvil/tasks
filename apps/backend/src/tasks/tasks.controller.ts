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
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { TaskDto } from './dto/task.dto';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @ApiOperation({ summary: 'タスク一覧を取得する' })
  @ApiOkResponse({ type: TaskDto, isArray: true })
  @Get()
  async findAll(): Promise<Task[]> {
    return await this.taskService.findAll();
  }

  @ApiOperation({ summary: 'タスクを作成する' })
  @ApiOkResponse({ type: TaskDto })
  @ApiBadRequestResponse({
    description: '入力値が不正です',
    type: ErrorResponseDto,
  })
  @Post()
  async create(@Body() dto: CreateTaskDto): Promise<Task> {
    return await this.taskService.create(dto);
  }

  @ApiOperation({ summary: '指定したタスクを更新する' })
  @ApiOkResponse({ type: TaskDto })
  @ApiBadRequestResponse({
    description: '入力値が不正です',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'タスクが見つかりません',
    type: ErrorResponseDto,
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ): Promise<Task> {
    return await this.taskService.update(id, dto);
  }

  @ApiOperation({ summary: '指定したタスクを削除する' })
  @ApiNotFoundResponse({
    description: 'タスクが見つかりません',
    type: ErrorResponseDto,
  })
  @Delete()
  async deleteAll(): Promise<void> {
    return await this.taskService.deleteAll();
  }

  @ApiOperation({ summary: '全タスクを削除する' })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.taskService.delete(id);
  }
}
