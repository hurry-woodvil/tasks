import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Task } from '@tasks/models/task';
import { TaskRepository } from './task-repository';

const STORAGE_KEY = 'tasks';

@Injectable()
export class LocalStorageTaskRepository implements TaskRepository {
  findAll(): Observable<Task[]> {
    return of(this.loadTasks());
  }

  create(task: Task): Observable<Task> {
    const tasks = this.loadTasks();

    this.saveTask([...tasks, task]);

    return of(task);
  }

  update(task: Task): Observable<Task> {
    const tasks = this.loadTasks();

    this.saveTask(tasks.map((currentTask) => (currentTask.id === task.id ? task : currentTask)));

    return of(task);
  }

  delete(id: string): Observable<void> {
    const tasks = this.loadTasks();

    this.saveTask(tasks.filter((task) => task.id !== id));

    return of(void 0);
  }

  private loadTasks(): Task[] {
    const value = localStorage.getItem(STORAGE_KEY);

    if (!value) {
      return [];
    }

    try {
      return JSON.parse(value) as Task[];
    } catch {
      return [];
    }
  }

  private saveTask(tasks: Task[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }
}
