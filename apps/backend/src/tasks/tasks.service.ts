import { Injectable, NotFoundException } from '@nestjs/common';

import { Task } from './models/task';
import { TaskRepository } from './tasks.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async findAll(): Promise<Task[]> {
    return this.taskRepository.findAll();
  }

  async create(dto: CreateTaskDto): Promise<Task> {
    const now = new Date();

    const task: Task = {
      id: crypto.randomUUID(),
      title: dto.title,
      dueDate: dto.dueDate,
      status: 'todo',
      createdAt: now,
      updatedAt: now,
    };

    return this.taskRepository.create(task);
  }

  async update(id: string, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new NotFoundException(`Task not found: ${id}`);
    }

    return await this.taskRepository.update({
      ...task,
      title: dto.title,
      status: dto.status,
      dueDate: dto.dueDate,
      updatedAt: new Date(),
    });
  }

  async delete(id: string): Promise<void> {
    await this.taskRepository.delete(id);
  }

  async deleteAll(): Promise<void> {
    await this.taskRepository.deleteAll();
  }
}
