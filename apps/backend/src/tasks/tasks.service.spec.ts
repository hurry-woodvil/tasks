import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { Task } from './models/task';
import { TaskRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

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

describe('TaskService', () => {
  let service: TasksService;
  let repositoy: {
    findAll: jest.Mock;
    findById: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    deleteAll: jest.Mock;
  };

  beforeEach(async () => {
    repositoy = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn((task: Task) => task),
      update: jest.fn((task: Task) => task),
      delete: jest.fn(),
      deleteAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TaskRepository,
          useValue: repositoy,
        },
      ],
    }).compile();

    service = module.get(TasksService);
  });

  it('finds all tasks', async () => {
    const tasks = [createTask()];
    repositoy.findAll.mockReturnValue(tasks);

    await expect(service.findAll()).resolves.toEqual(tasks);
    expect(repositoy.findAll).toHaveBeenCalled();
  });

  it('creates a task', async () => {
    const result = await service.create({
      title: 'Angularを学ぶ',
      dueDate: '2026-07-10',
    });

    expect(repositoy.create).toHaveBeenCalled();

    expect(result.title).toBe('Angularを学ぶ');
    expect(result.status).toBe('todo');
    expect(result.dueDate).toBe('2026-07-10');
    expect(result.id).toEqual(expect.any(String));
    expect(result.createdAt).toEqual(expect.any(Date));
    expect(result.updatedAt).toEqual(expect.any(Date));
  });

  it('updates a task', async () => {
    const task = createTask({
      createdAt: new Date('2026-07-01T00:00:00.000Z'),
    });

    repositoy.findById.mockReturnValue(task);

    const result = await service.update('1', {
      title: 'Angular Signalsを学ぶ',
      status: 'done',
      dueDate: '2026-07-10',
    });

    expect(repositoy.findById).toHaveBeenCalledWith('1');
    expect(repositoy.update).toHaveBeenCalled();

    expect(result.id).toBe('1');
    expect(result.title).toBe('Angular Signalsを学ぶ');
    expect(result.status).toBe('done');
    expect(result.dueDate).toBe('2026-07-10');
    expect(result.createdAt).toBe(task.createdAt);
    expect(result.updatedAt).toEqual(expect.any(Date));
  });

  it('throws NotFoundException when updating missing task', async () => {
    repositoy.findById.mockReturnValue(undefined);

    await expect(() =>
      service.update('missing-id', {
        title: '存在しないタスク',
        status: 'todo',
        dueDate: null,
      }),
    ).rejects.toThrow(NotFoundException);

    expect(repositoy.update).not.toHaveBeenCalled();
  });

  it('deletes a task', async () => {
    await service.delete('1');

    expect(repositoy.delete).toHaveBeenCalledWith('1');
  });

  it('deletes all tasks', async () => {
    await service.deleteAll();

    expect(repositoy.deleteAll).toHaveBeenCalled();
  });
});
