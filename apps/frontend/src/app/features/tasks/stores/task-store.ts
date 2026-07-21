import { Injectable, signal, computed, inject } from '@angular/core';

import { Task, TaskFilter, TaskSort } from '@tasks/models/task';
import { TASK_REPOSITORY, TaskRepository } from '@tasks/data-access/task-repository';

@Injectable({
  providedIn: 'root',
})
export class TaskStore {
  private readonly taskRepository = inject<TaskRepository>(TASK_REPOSITORY);

  private readonly _tasks = signal<Task[]>([]);
  readonly tasks = this._tasks.asReadonly();

  private readonly _loading = signal(false);
  readonly loading = this._loading.asReadonly();

  private readonly _error = signal<string | null>(null);
  readonly error = this._error.asReadonly();

  private readonly _recentlyDeletedTask = signal<Task | null>(null);
  readonly recentlyDeletedTask = this._recentlyDeletedTask.asReadonly();

  private readonly _filter = signal<TaskFilter>('all');
  readonly filter = this._filter.asReadonly();

  private readonly _searchQuery = signal('');
  readonly searchQuery = this._searchQuery.asReadonly();

  private readonly _sort = signal<TaskSort>('createdAt');
  readonly sort = this._sort.asReadonly();

  private readonly _currentPage = signal(1);
  readonly currentPage = this._currentPage.asReadonly();

  private readonly _pageSize = signal(5);
  readonly pageSize = this._pageSize.asReadonly();

  /**
   * Test Helper
   *
   * 本番コードでは利用しない。
   */
  setTasksForTest(tasks: Task[]): void {
    this._tasks.set(tasks);
  }

  /**
   * Test Helper
   */
  setErrorForForTest(error: string | null): void {
    this._error.set(error);
  }

  setFilter(filter: TaskFilter): void {
    this._filter.set(filter);
    this._currentPage.set(1);
  }

  setSearchQuery(searchQuery: string): void {
    this._searchQuery.set(searchQuery);
    this._currentPage.set(1);
  }

  setSort(sort: TaskSort): void {
    this._sort.set(sort);
    this._currentPage.set(1);
  }

  setCurrentPage(page: number): void {
    this._currentPage.set(page);
  }

  setPageSize(pageSize: number): void {
    this._pageSize.set(pageSize);
    this._currentPage.set(1);
  }

  private findTask(id: string): Task | undefined {
    return this._tasks().find((task) => task.id === id);
  }

  private replaceTask(updatedTask: Task): void {
    this._tasks.update((tasks) =>
      tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
    );
  }

  private saveTask(updatedTask: Task): void {
    this._error.set(null);

    this.taskRepository.update(updatedTask).subscribe({
      next: (savedTask) => {
        this.replaceTask(savedTask);
      },
      error: () => {
        this._error.set('タスクの更新に失敗しました');
      },
    });
  }

  private clampCurrentPage(): void {
    this._currentPage.update((page) => Math.min(Math.max(page, 1), this.totalPages()));
  }

  loadTasks(): void {
    this._loading.set(true);
    this._error.set(null);

    this.taskRepository.findAll().subscribe({
      next: (tasks) => {
        this._tasks.set(tasks);

        this.clampCurrentPage();

        this._loading.set(false);
      },
      error: () => {
        this._error.set('タスクの取得に失敗しました');
        this._loading.set(false);
      },
    });
  }

  readonly totalPages = computed(() => {
    return Math.max(1, Math.ceil(this.filteredTasks().length / this._pageSize()));
  });

  readonly pagedTasks = computed(() => {
    const currentPage = this._currentPage();
    const pageSize = this._pageSize();
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;

    return this.filteredTasks().slice(start, end);
  });

  readonly filteredTasks = computed(() => {
    const filter = this._filter();
    const searchQuery = this._searchQuery().trim().toLowerCase();
    const sort = this._sort();

    return [...this._tasks()]
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
    this._error.set(null);

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
        this._tasks.update((tasks) => [...tasks, createdTask]);
      },
      error: () => {
        this._error.set('タスクの追加に失敗しました');
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
    this._error.set(null);

    const task = this.findTask(id);

    if (!task) {
      return;
    }

    this.taskRepository.delete(id).subscribe({
      next: () => {
        this._recentlyDeletedTask.set(task);

        this._tasks.update((tasks) => tasks.filter((task) => task.id !== id));

        this.clampCurrentPage();
      },
      error: () => {
        this._error.set('タスクの削除に失敗しました');
      },
    });
  }

  undoDeleteTask(): void {
    this._error.set(null);

    const task = this.recentlyDeletedTask();

    if (!task) {
      return;
    }

    this.taskRepository.create(task).subscribe({
      next: (createdTask) => {
        this._tasks.update((tasks) => [...tasks, createdTask]);

        this._recentlyDeletedTask.set(null);

        this.clampCurrentPage();
      },
      error: () => {
        this._error.set('タスクの復元に失敗しました');
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
    if (this._currentPage() >= this.totalPages()) {
      return;
    }

    this._currentPage.update((page) => page + 1);
  }

  goToPreviousPage(): void {
    if (this._currentPage() <= 1) {
      return;
    }

    this._currentPage.update((page) => page - 1);
  }

  goToPage(page: number): void {
    const validPage = Math.min(Math.max(page, 1), this.totalPages());
    this._currentPage.set(validPage);
  }
}
