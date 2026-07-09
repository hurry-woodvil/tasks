import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import { Task } from '@tasks/models/task';

export interface TaskRepository {
  findAll(): Observable<Task[]>;
  create(task: Task): Observable<Task>;
  update(task: Task): Observable<Task>;
  delete(id: string): Observable<void>;
}

export const TASK_REPOSITORY = new InjectionToken<TaskRepository>('TASK_REPOSITORY');
