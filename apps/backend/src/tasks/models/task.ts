export type TaskStatus = 'todo' | 'done';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  dueDate: string | null;
  createdAt: Date;
  updatedAt: Date;
}
