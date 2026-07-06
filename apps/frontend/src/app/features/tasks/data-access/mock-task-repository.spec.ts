import { Task } from '@tasks/models/task';
import { MockTaskRepository } from './mock-task-repository';

describe('MockTaskRepository', () => {
  let repository: MockTaskRepository;

  beforeEach(() => {
    repository = new MockTaskRepository();
  });

  it('finds all tasks', () => {
    repository.findAll().subscribe((tasks) => {
      expect(tasks).toHaveLength(2);
    });
  });

  it('creates a task', () => {
    const task: Task = {
      id: '3',
      title: 'Mock: 新規タスク',
      status: 'todo',
      dueDate: null,
      createdAt: '2026-07-03T00:00:00.000Z',
      updatedAt: '2026-07-03T00:00:00.000Z',
    };

    repository.create(task).subscribe();

    repository.findAll().subscribe((tasks) => {
      expect(tasks).toContainEqual(task);
    });
  });
});
