import { Injectable } from '@nestjs/common';

import { Task } from './models/task';
import { TaskRepository } from './task.repository';

@Injectable()
export class InMemoryTaskRepository implements TaskRepository {
  private tasks: Task[] = [];

  findAll(): Task[] {
    return [...this.tasks];
  }

  create(task: Task): Task {
    this.tasks = [...this.tasks, task];

    return task;
  }

  update(task: Task): Task {
    this.tasks = this.tasks.map((currentTask) =>
      currentTask.id === task.id ? task : currentTask,
    );

    return task;
  }

  delete(id: string): void {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }
}
