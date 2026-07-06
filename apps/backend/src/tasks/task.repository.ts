import { Task } from './models/task';

export abstract class TaskRepository {
  abstract findAll(): Task[];
  abstract create(task: Task): Task;
  abstract update(task: Task): Task;
  abstract delete(id: string): void;
}
