import { InMemoryTaskRepository } from './in-memory-task.repository';
import { Task } from './models/task';

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

describe('InMemoryTaskRepository', () => {
  let repositoy: InMemoryTaskRepository;

  beforeEach(() => {
    repositoy = new InMemoryTaskRepository();
  });

  it('returns empty tasks by default', () => {
    expect(repositoy.findAll()).toEqual([]);
  });

  it('creates a task', () => {
    const task = createTask();

    expect(repositoy.create(task)).toEqual(task);
    expect(repositoy.findAll()).toEqual([task]);
  });

  it('finds a task by id', () => {
    const task = createTask();

    repositoy.create(task);

    expect(repositoy.findById('1')).toEqual(task);
  });

  it('returns undefined when task is not found', () => {
    expect(repositoy.findById('missing-id')).toBeUndefined();
  });

  it('updates a task', () => {
    const task = createTask();
    const updatedTask = createTask({
      title: 'Angular Signalsを学ぶ',
      status: 'done',
      dueDate: '2026-07-10',
    });

    repositoy.create(task);

    expect(repositoy.update(updatedTask)).toEqual(updatedTask);
    expect(repositoy.findById('1')).toEqual(updatedTask);
  });

  it('deletes a task', () => {
    const task = createTask();

    repositoy.create(task);
    repositoy.delete('1');

    expect(repositoy.findAll()).toEqual([]);
  });

  it('deletes all tasks', () => {
    repositoy.create(createTask({ id: '1' }));
    repositoy.create(createTask({ id: '2', title: 'Reactを学ぶ' }));

    repositoy.deleteAll();

    expect(repositoy.findAll()).toEqual([]);
  });
});
