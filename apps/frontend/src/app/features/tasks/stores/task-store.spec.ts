import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { Task } from '@tasks/models/task';
import { TaskStore } from '@tasks/stores/task-store';
import { TASK_REPOSITORY } from '@tasks/data-access/task-repository';

function createTask(override: Partial<Task> = {}): Task {
  return {
    id: '1',
    title: 'Angularを学ぶ',
    status: 'todo',
    dueDate: null,
    createdAt: '2026-07-01T00:00:00.000Z',
    updatedAt: '2026-07-01T00:00:00.000Z',
    ...override,
  };
}

function createTasks(count: number): Task[] {
  return Array.from({ length: count }, (_, index) =>
    createTask({ id: String(index + 1), title: `タスク${index + 1}` }),
  );
}

describe('TaskStore', () => {
  let store: TaskStore;
  let repositoryMock: {
    findAll: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    repositoryMock = {
      findAll: vi.fn(() => of([])),
      create: vi.fn((task: Task) => of(task)),
      update: vi.fn((task: Task) => of(task)),
      delete: vi.fn(() => of(void 0)),
    };

    TestBed.configureTestingModule({
      providers: [
        TaskStore,
        {
          provide: TASK_REPOSITORY,
          useValue: repositoryMock,
        },
      ],
    });

    store = TestBed.inject(TaskStore);
  });

  describe('loading tasks', () => {
    it('loads tasks', () => {
      const tasks = createTasks(6);
      repositoryMock.findAll.mockReturnValue(of(tasks));

      store.loadTasks();

      expect(repositoryMock.findAll).toHaveBeenCalled();
      expect(store.tasks()).toEqual(tasks);
      expect(store.loading()).toBe(false);
      expect(store.error()).toBeNull();
    });

    it('sets error when loading tasks fails', () => {
      repositoryMock.findAll.mockReturnValue(throwError(() => new Error('network error')));

      store.loadTasks();

      expect(store.error()).toBe('タスクの取得に失敗しました');
      expect(store.loading()).toBe(false);
    });

    it('clears error when loading tasks starts', () => {
      store.error.set('前回のエラー');

      store.loadTasks();

      expect(store.error()).toBeNull();
    });
  });

  describe('creating tasks', () => {
    it('adds a task without dueDate', () => {
      store.addTask('Angularを学ぶ', null);

      expect(repositoryMock.create).toHaveBeenCalled();
      expect(store.tasks()).toHaveLength(1);
      expect(store.tasks()[0].title).toBe('Angularを学ぶ');
      expect(store.tasks()[0].status).toBe('todo');
      expect(store.tasks()[0].dueDate).toBeNull();
    });

    it('adds a task with dueDate', () => {
      store.addTask('Angularを学ぶ', '2026-07-01');

      expect(repositoryMock.create).toHaveBeenCalled();
      expect(store.tasks()).toHaveLength(1);
      expect(store.tasks()[0].title).toBe('Angularを学ぶ');
      expect(store.tasks()[0].status).toBe('todo');
      expect(store.tasks()[0].dueDate).toBe('2026-07-01');
    });

    it('clears error when adding task succeeds', () => {
      store.error.set('前回のエラー');

      store.addTask('Angularを学ぶ', null);

      expect(store.error()).toBeNull();
    });
  });

  describe('updating tasks', () => {
    it('toggles a task to "done"', () => {
      store.tasks.set([createTask()]);

      store.toggleTask('1');

      expect(repositoryMock.update).toHaveBeenCalled();

      expect(store.tasks()[0].status).toBe('done');
    });

    it('toggles a task to "todo"', () => {
      store.tasks.set([createTask()]);

      store.toggleTask('1');

      expect(store.tasks()[0].status).toBe('done');

      store.toggleTask('1');

      expect(store.tasks()[0].status).toBe('todo');
    });

    it('updates a task without dueDate', () => {
      store.tasks.set([createTask({ dueDate: '2026-07-01' })]);

      expect(store.tasks()[0].title).toBe('Angularを学ぶ');
      expect(store.tasks()[0].dueDate).toBe('2026-07-01');

      store.updateTask('1', 'Angular Signalsを学ぶ', null);

      expect(repositoryMock.update).toHaveBeenCalled();

      expect(store.tasks()[0].title).toBe('Angular Signalsを学ぶ');
      expect(store.tasks()[0].dueDate).toBeNull();
    });

    it('updates a task with dueDate', () => {
      store.tasks.set([createTask({ dueDate: '2026-07-01' })]);

      expect(store.tasks()[0].title).toBe('Angularを学ぶ');
      expect(store.tasks()[0].dueDate).toBe('2026-07-01');

      store.updateTask('1', 'Angular Signalsを学ぶ', '2026-12-31');

      expect(repositoryMock.update).toHaveBeenCalled();

      expect(store.tasks()[0].title).toBe('Angular Signalsを学ぶ');
      expect(store.tasks()[0].dueDate).toBe('2026-12-31');
    });
  });

  describe('deleting tasks', () => {
    it('deletes a task', () => {
      store.tasks.set([createTask()]);

      store.deleteTask('1');

      expect(repositoryMock.delete).toHaveBeenCalledWith('1');

      expect(store.tasks()).toHaveLength(0);
    });

    it('sets recently deleted task when task is deleted', () => {
      const task = createTask();
      store.tasks.set([task]);

      store.deleteTask('1');

      expect(store.recentlyDeletedTask()).toEqual(task);
    });
  });

  describe('undo delete', () => {
    it('restores recently deleted task', () => {
      const task = createTask();
      store.tasks.set([task]);

      store.deleteTask(task.id);

      store.undoDeleteTask();

      expect(repositoryMock.create).toHaveBeenCalledWith(task);

      expect(store.tasks()).toStrictEqual([task]);
      expect(store.recentlyDeletedTask()).toBeNull();
    });

    it('does nothing when there is no recently deleted task', () => {
      const task = createTask();
      store.tasks.set([task]);

      store.undoDeleteTask();

      expect(repositoryMock.create).not.toHaveBeenCalled();

      expect(store.tasks()).toEqual([task]);
      expect(store.recentlyDeletedTask()).toBeNull();
    });

    it('sets error when restoring deleted task fails', () => {
      const task = createTask();
      store.tasks.set([task]);

      store.deleteTask(task.id);

      repositoryMock.create.mockReturnValue(throwError(() => new Error('network error')));

      store.undoDeleteTask();

      expect(store.error()).toBe('タスクの復元に失敗しました');
      expect(store.recentlyDeletedTask()).toEqual(task);
    });
  });

  describe('filtering and searching', () => {
    it('filters todo tasks', () => {
      const todoTask = createTask({ id: '1', title: '未完了タスク' });
      const doneTask = createTask({ id: '2', title: '完了済みタスク', status: 'done' });
      store.tasks.set([todoTask, doneTask]);

      store.setFilter('todo');

      expect(store.filteredTasks()).toHaveLength(1);
      expect(store.filteredTasks()).toStrictEqual([todoTask]);
      expect(store.filteredTasks()[0].status).toBe('todo');
    });

    it('filters done tasks', () => {
      const todoTask = createTask({ id: '1', title: '未完了タスク' });
      const doneTask = createTask({ id: '2', title: '完了済みタスク', status: 'done' });
      store.tasks.set([todoTask, doneTask]);

      store.setFilter('done');

      expect(store.filteredTasks()).toHaveLength(1);
      expect(store.filteredTasks()).toStrictEqual([doneTask]);
      expect(store.filteredTasks()[0].status).toBe('done');
    });

    it('shows all tasks when filter is all', () => {
      const todoTask = createTask({ id: '1', title: '未完了タスク' });
      const doneTask = createTask({ id: '2', title: '完了済みタスク', status: 'done' });
      store.tasks.set([todoTask, doneTask]);

      store.setFilter('todo');

      expect(store.filteredTasks()).toHaveLength(1);

      store.setFilter('all');

      expect(store.filteredTasks()).toHaveLength(2);
    });

    it('filters tasks by search query', () => {
      const angularTask = createTask({ id: '1' });
      const reactTask = createTask({ id: '2', title: 'Reactを学ぶ' });
      store.tasks.set([angularTask, reactTask]);

      store.setSearchQuery('Angular');

      expect(store.filteredTasks()).toHaveLength(1);
      expect(store.filteredTasks()[0].title).toBe('Angularを学ぶ');
    });
  });

  describe('sorting', () => {
    it('sorts tasks by title', () => {
      const task2 = createTask({ id: '1', title: 'B: Angularを学ぶ' });
      const task1 = createTask({ id: '2', title: 'A: Reactを学ぶ' });
      const task3 = createTask({ id: '3', title: 'C: Vueを学ぶ' });
      store.tasks.set([task2, task1, task3]);

      store.setSort('title');

      expect(store.filteredTasks()[0].title).toBe(task1.title);
      expect(store.filteredTasks()[1].title).toBe(task2.title);
      expect(store.filteredTasks()[2].title).toBe(task3.title);
    });

    it('sorts tasks by dueDate', () => {
      const task2 = createTask({ id: '1', dueDate: '2026-06-01' });
      const task1 = createTask({ id: '2', dueDate: '2026-01-01' });
      const task3 = createTask({ id: '3', dueDate: '2026-12-01' });
      store.tasks.set([task2, task1, task3]);

      store.setSort('dueDate');

      expect(store.filteredTasks()[0].dueDate).toBe(task1.dueDate);
      expect(store.filteredTasks()[1].dueDate).toBe(task2.dueDate);
      expect(store.filteredTasks()[2].dueDate).toBe(task3.dueDate);
    });

    it('sorts tasks by createdAt', () => {
      const task2 = createTask({ id: '1', createdAt: '2026-06-01T00:00:00.000Z' });
      const task1 = createTask({ id: '2', createdAt: '2026-01-01T00:00:00.000Z' });
      const task3 = createTask({ id: '3', createdAt: '2026-12-01T00:00:00.000Z' });
      store.tasks.set([task2, task1, task3]);

      store.setSort('createdAt');

      expect(store.filteredTasks()[0].createdAt).toBe(task3.createdAt);
      expect(store.filteredTasks()[1].createdAt).toBe(task2.createdAt);
      expect(store.filteredTasks()[2].createdAt).toBe(task1.createdAt);
    });
  });

  describe('pagination', () => {
    it('returns paged tasks', () => {
      const tasks = createTasks(6);
      store.tasks.set(tasks);

      expect(store.pagedTasks()).toHaveLength(5);
    });

    it('calculates total pages', () => {
      const tasks = createTasks(6);
      store.tasks.set(tasks);

      expect(store.totalPages()).toBe(2);
    });

    it('goes to next page', () => {
      const tasks = createTasks(6);
      store.tasks.set(tasks);

      store.goToNextPage();

      expect(store.currentPage()).toBe(2);
      expect(store.pagedTasks()).toHaveLength(1);
    });

    it('does not go beyond last page', () => {
      const tasks = createTasks(1);
      store.tasks.set(tasks);

      store.goToNextPage();

      expect(store.currentPage()).toBe(1);
    });

    it('goes to previous page', () => {
      const tasks = createTasks(6);
      store.tasks.set(tasks);

      store.goToNextPage();
      store.goToPreviousPage();

      expect(store.currentPage()).toBe(1);
      expect(store.pagedTasks()).toHaveLength(5);
    });

    it('does not go before first page', () => {
      const tasks = createTasks(1);
      store.tasks.set(tasks);

      store.goToPreviousPage();

      expect(store.currentPage()).toBe(1);
    });

    it('resets current page when search query changes', () => {
      const tasks = createTasks(6);
      store.tasks.set(tasks);

      store.goToNextPage();
      expect(store.currentPage()).toBe(2);

      store.setSearchQuery('タスク');
      expect(store.currentPage()).toBe(1);
    });
  });
});
