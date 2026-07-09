import { Task } from './models/task';

export abstract class TaskRepository {
  abstract findAll(): Promise<Task[]>;

  abstract findById(id: string): Promise<Task | undefined>;

  abstract create(task: Task): Promise<Task>;

  abstract update(task: Task): Promise<Task>;

  abstract delete(id: string): Promise<void>;

  abstract deleteAll(): Promise<void>;
}
