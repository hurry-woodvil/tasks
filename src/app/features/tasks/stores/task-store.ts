import { Injectable, signal, computed, inject } from '@angular/core';

import { Task, TaskFilter, TaskSort } from '@tasks/models/task';
import { TaskRepository } from '@tasks/data-access/task-repository';

@Injectable({
  providedIn: 'root',
})
export class TaskStore {
  private readonly taskRepository = inject(TaskRepository);

  readonly tasks = signal<Task[]>([]);
  readonly filter = signal<TaskFilter>('all');
  readonly searchQuery = signal('');
  readonly sort = signal<TaskSort>('createdAt');

  readonly currentPage = signal(1);
  readonly pageSize = signal(5);

  readonly recentlyDeletedTask = signal<Task | null>(null);

  setFilter(filter: TaskFilter): void {
    this.filter.set(filter);
    this.currentPage.set(1);
  }

  setSearchQuery(searchQuery: string): void {
    this.searchQuery.set(searchQuery);
    this.currentPage.set(1);
  }

  setSort(sort: TaskSort): void {
    this.sort.set(sort);
    this.currentPage.set(1);
  }

  setCurrentPage(page: number): void {
    this.currentPage.set(page);
  }

  setPageSize(pageSize: number): void {
    this.pageSize.set(pageSize);
    this.currentPage.set(1);
  }

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  private findTask(id: string): Task | undefined {
    return this.tasks().find((task) => task.id === id);
  }

  private replaceTask(updatedTask: Task): void {
    this.tasks.update((tasks) =>
      tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
    );
  }

  private saveTask(updatedTask: Task): void {
    this.error.set(null);

    this.taskRepository.update(updatedTask).subscribe({
      next: (savedTask) => {
        this.replaceTask(savedTask);
      },
      error: () => {
        this.error.set('タスクの更新に失敗しました');
      },
    });
  }

  loadTasks(): void {
    this.loading.set(true);
    this.error.set(null);

    this.taskRepository.findAll().subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('タスクの取得に失敗しました');
        this.loading.set(false);
      },
    });
  }

  readonly totalPages = computed(() => {
    return Math.max(1, Math.ceil(this.filteredTasks().length / this.pageSize()));
  });

  readonly pagedTasks = computed(() => {
    const currentPage = this.currentPage();
    const pageSize = this.pageSize();
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;

    return this.filteredTasks().slice(start, end);
  });

  readonly filteredTasks = computed(() => {
    const filter = this.filter();
    const searchQuery = this.searchQuery().trim().toLowerCase();
    const sort = this.sort();

    return [...this.tasks()]
      .filter((task) => {
        const matchesStatus = filter === 'all' || task.status === filter;
        const matchesSearchQuery =
          searchQuery === '' || task.title.toLowerCase().includes(searchQuery);

        return matchesStatus && matchesSearchQuery;
      })
      .sort((a, b) => {
        if (sort === 'title') {
          return a.title.localeCompare(b.title);
        }

        if (sort === 'dueDate') {
          return (a.dueDate ?? '9999-12-31').localeCompare(b.dueDate ?? '9999-12-31');
        }

        return b.createdAt.localeCompare(a.createdAt);
      });
  });

  addTask(title: string, dueDate: string | null): void {
    this.error.set(null);

    const now = new Date().toISOString();

    const task: Task = {
      id: crypto.randomUUID(),
      title,
      status: 'todo',
      dueDate,
      createdAt: now,
      updatedAt: now,
    };

    this.taskRepository.create(task).subscribe({
      next: (createdTask) => {
        this.tasks.update((tasks) => [...tasks, createdTask]);
      },
      error: () => {
        this.error.set('タスクの追加に失敗しました');
      },
    });
  }

  toggleTask(id: string): void {
    const task = this.findTask(id);

    if (!task) {
      return;
    }

    this.saveTask({
      ...task,
      status: task.status === 'todo' ? 'done' : 'todo',
      updatedAt: new Date().toISOString(),
    });
  }

  deleteTask(id: string): void {
    this.error.set(null);

    const task = this.findTask(id);

    if (!task) {
      return;
    }

    this.taskRepository.delete(id).subscribe({
      next: () => {
        this.recentlyDeletedTask.set(task);
        this.tasks.update((tasks) => tasks.filter((task) => task.id !== id));
      },
      error: () => {
        this.error.set('タスクの削除に失敗しました');
      },
    });
  }

  undoDeleteTask(): void {
    this.error.set(null);

    const task = this.recentlyDeletedTask();

    if (!task) {
      return;
    }

    this.taskRepository.create(task).subscribe({
      next: (createdTask) => {
        this.tasks.update((tasks) => [...tasks, createdTask]);
        this.recentlyDeletedTask.set(null);
      },
      error: () => {
        this.error.set('タスクの復元に失敗しました');
      },
    });
  }

  updateTask(id: string, title: string, dueDate: string | null): void {
    const task = this.findTask(id);

    if (!task) {
      return;
    }

    this.saveTask({
      ...task,
      title,
      dueDate,
      updatedAt: new Date().toISOString(),
    });
  }

  goToNextPage(): void {
    if (this.currentPage() >= this.totalPages()) {
      return;
    }

    this.currentPage.update((page) => page + 1);
  }

  goToPreviousPage(): void {
    if (this.currentPage() <= 1) {
      return;
    }

    this.currentPage.update((page) => page - 1);
  }

  goToPage(page: number): void {
    const validPage = Math.min(Math.max(page, 1), this.totalPages());
    this.currentPage.set(validPage);
  }
}
