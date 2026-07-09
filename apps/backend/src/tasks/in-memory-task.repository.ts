import { Injectable } from '@nestjs/common';

import { Task } from './models/task';
import { TaskRepository } from './tasks.repository';

@Injectable()
export class InMemoryTaskRepository implements TaskRepository {
  private tasks: Task[] = [];

  async findAll(): Promise<Task[]> {
    return [...this.tasks];
  }

  async findById(id: string): Promise<Task | undefined> {
    return this.tasks.find((task) => task.id === id);
  }

  async create(task: Task): Promise<Task> {
    this.tasks = [...this.tasks, task];

    return task;
  }

  async update(task: Task): Promise<Task> {
    this.tasks = this.tasks.map((currentTask) =>
      currentTask.id === task.id ? task : currentTask,
    );

    return task;
  }

  async delete(id: string): Promise<void> {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }

  async deleteAll(): Promise<void> {
    this.tasks = [];
  }
}
