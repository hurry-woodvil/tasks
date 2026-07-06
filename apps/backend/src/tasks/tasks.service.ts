import { Injectable, NotFoundException } from '@nestjs/common';

import { Task } from './models/task';
import { TaskRepository } from './tasks.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly taskRepository: TaskRepository) {}

  findAll(): Task[] {
    return this.taskRepository.findAll();
  }

  create(dto: CreateTaskDto): Task {
    const now = new Date().toISOString();

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

  update(id: string, dto: UpdateTaskDto): Task {
    const task = this.taskRepository.findById(id);

    if (!task) {
      throw new NotFoundException(`Task not found: ${id}`);
    }

    return this.taskRepository.update({
      ...task,
      title: dto.title,
      status: dto.status,
      dueDate: dto.dueDate,
      updatedAt: new Date().toISOString(),
    });
  }

  delete(id: string): void {
    this.taskRepository.delete(id);
  }

  deleteAll(): void {
    this.taskRepository.deleteAll();
  }
}
