import { Task } from '@tasks/models/task';
import { LocalStorageTaskRepository } from './local-storage-task-repository';

function createTask(overrides: Partial<Task> = {}): Task {
  return {
    id: '1',
    title: 'Angularを学ぶ',
    status: 'todo',
    dueDate: null,
    createdAt: '2026-07-01T00:00:00.000Z',
    updatedAt: '2026-07-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('LocalStorageTaskRepository', () => {
  let repository: LocalStorageTaskRepository;

  beforeEach(() => {
    localStorage.clear();
    repository = new LocalStorageTaskRepository();
  });

  it('returns empty tasks when localStorage has no tasks', () => {
    repository.findAll().subscribe((tasks) => {
      expect(tasks).toEqual([]);
    });
  });

  it('creates a task', () => {
    const task = createTask();

    repository.create(task).subscribe((createdTask) => {
      expect(createdTask).toEqual(task);
    });

    repository.findAll().subscribe((tasks) => {
      expect(tasks).toEqual([task]);
    });
  });

  it('updates a task', () => {
    const task = createTask();
    const updatedTask = createTask({
      title: 'Angular Signalsを学ぶ',
      status: 'done',
      dueDate: '2026-07-10',
    });

    repository.create(task).subscribe();

    repository.update(updatedTask).subscribe((result) => {
      expect(result).toEqual(updatedTask);
    });

    repository.findAll().subscribe((tasks) => {
      expect(tasks).toEqual([updatedTask]);
    });
  });

  it('deletes a task', () => {
    const task = createTask();

    repository.create(task).subscribe();

    repository.delete(task.id).subscribe((tasks) => {
      expect(tasks).toBeUndefined();
    });

    repository.findAll().subscribe((tasks) => {
      expect(tasks).toEqual([]);
    });
  });

  it('returns empty tasks when localStorage value is invalid JSON', () => {
    localStorage.setItem('tasks', '{invalid json');

    repository.findAll().subscribe((tasks) => {
      expect(tasks).toEqual([]);
    });
  });
});
