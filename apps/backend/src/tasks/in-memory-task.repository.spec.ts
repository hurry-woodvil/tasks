import { InMemoryTaskRepository } from './in-memory-task.repository';
import { Task } from './models/task';

function createTask(overrides: Partial<Task> = {}): Task {
  return {
    id: '1',
    title: 'Angularを学ぶ',
    status: 'todo',
    dueDate: null,
    createdAt: new Date('2026-07-01T00:00:00.000Z'),
    updatedAt: new Date('2026-07-01T00:00:00.000Z'),
    ...overrides,
  };
}

describe('InMemoryTaskRepository', () => {
  let repositoy: InMemoryTaskRepository;

  beforeEach(() => {
    repositoy = new InMemoryTaskRepository();
  });

  it('returns empty tasks by default', async () => {
    await expect(repositoy.findAll()).resolves.toEqual([]);
  });

  it('creates a task', async () => {
    const task = createTask();

    await expect(repositoy.create(task)).resolves.toEqual(task);
    await expect(repositoy.findAll()).resolves.toEqual([task]);
  });

  it('finds a task by id', async () => {
    const task = createTask();

    await repositoy.create(task);

    await expect(repositoy.findById('1')).resolves.toEqual(task);
  });

  it('returns undefined when task is not found', async () => {
    await expect(repositoy.findById('missing-id')).resolves.toBeUndefined();
  });

  it('updates a task', async () => {
    const task = createTask();
    const updatedTask = createTask({
      title: 'Angular Signalsを学ぶ',
      status: 'done',
      dueDate: '2026-07-10',
    });

    await repositoy.create(task);

    await expect(repositoy.update(updatedTask)).resolves.toEqual(updatedTask);
    await expect(repositoy.findById('1')).resolves.toEqual(updatedTask);
  });

  it('deletes a task', async () => {
    const task = createTask();

    await repositoy.create(task);
    await repositoy.delete('1');

    await expect(repositoy.findAll()).resolves.toEqual([]);
  });

  it('deletes all tasks', async () => {
    await repositoy.create(createTask({ id: '1' }));
    await repositoy.create(createTask({ id: '2', title: 'Reactを学ぶ' }));

    await repositoy.deleteAll();

    await expect(repositoy.findAll()).resolves.toEqual([]);
  });
});
