import { Task } from './models/task';

export abstract class TaskRepository {
  abstract findAll(): Task[];

  abstract findById(id: string): Task | undefined;

  abstract create(task: Task): Task;

  abstract update(task: Task): Task;

  abstract delete(id: string): void;

  abstract deleteAll(): void;
}
