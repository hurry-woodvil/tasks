export type TaskStatus = 'todo' | 'done';

export type TaskFilter = 'all' | TaskStatus;

export type TaskSort = 'createdAt' | 'dueDate' | 'title';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}
