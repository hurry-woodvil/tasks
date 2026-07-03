import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Task } from '@tasks/models/task';
import { TaskRepository } from './task-repository';

@Injectable()
export class MockTaskRepository implements TaskRepository {
  private tasks: Task[] = [
    {
      id: '1',
      title: 'Mock: Angularを学ぶ',
      status: 'todo',
      dueDate: null,
      createdAt: '2026-07-01T00:00:00.000Z',
      updatedAt: '2026-07-01T00:00:00.000Z',
    },
    {
      id: '2',
      title: 'Mock: Signalsを学ぶ',
      status: 'done',
      dueDate: '2026-07-10',
      createdAt: '2026-07-02T00:00:00.000Z',
      updatedAt: '2026-07-02T00:00:00.000Z',
    },
  ];

  findAll(): Observable<Task[]> {
    return of([...this.tasks]);
  }

  create(task: Task): Observable<Task> {
    this.tasks = [...this.tasks, task];

    return of(task);
  }

  update(task: Task): Observable<Task> {
    this.tasks = this.tasks.map((currentTask) => (currentTask.id === task.id ? task : currentTask));

    return of(task);
  }

  delete(id: string): Observable<void> {
    this.tasks = this.tasks.filter((task) => task.id !== id);

    return of(void 0);
  }
}
