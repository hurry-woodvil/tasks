import { Injectable } from '@nestjs/common';

import { Task } from './models/task';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
  constructor(private readonly taskRepository: TaskRepository) {}

  findAll(): Task[] {
    return this.taskRepository.findAll();
  }

  create(task: Task): Task {
    return this.taskRepository.create(task);
  }

  update(task: Task): Task {
    return this.taskRepository.update(task);
  }

  delete(id: string): void {
    this.taskRepository.delete(id);
  }
}
