import { Injectable } from '@nestjs/common';

import { Task } from './models/task';
import { TaskRepository } from './tasks.repository';

@Injectable()
export class InMemoryTaskRepository implements TaskRepository {
  private tasks: Task[] = [];

  async findAll(): Promise<Task[]> {
    return Promise.resolve([...this.tasks]);
  }

  async findById(id: string): Promise<Task | undefined> {
    return Promise.resolve(this.tasks.find((task) => task.id === id));
  }

  async create(task: Task): Promise<Task> {
    this.tasks = [...this.tasks, task];

    return Promise.resolve(task);
  }

  async update(task: Task): Promise<Task> {
    this.tasks = this.tasks.map((currentTask) =>
      currentTask.id === task.id ? task : currentTask,
    );

    return Promise.resolve(task);
  }

  async delete(id: string): Promise<void> {
    this.tasks = this.tasks.filter((task) => task.id !== id);

    return Promise.resolve();
  }

  async deleteAll(): Promise<void> {
    this.tasks = [];

    return Promise.resolve();
  }
}
