import { PrismaService } from '../prisma/prisma.service';
import { Task } from './models/task';
import { PrismaTaskRepository } from './prisma-task.repository';

type PrismaMock = {
  task: {
    findMany: jest.Mock;
    findUnique: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    deleteMany: jest.Mock;
  };
};

function createPrismaTask(overrides = {}) {
  return {
    id: '1',
    title: 'Angularを学ぶ',
    status: 'todo',
    dueDate: null,
    createdAt: new Date('2026-07-01T00:00:00.000'),
    updatedAt: new Date('2026-07-01T00:00:00.000'),
    ...overrides,
  };
}

function createTask(overrides: Partial<Task> = {}): Task {
  return {
    id: '1',
    title: 'Angularを学ぶ',
    status: 'todo',
    dueDate: null,
    createdAt: new Date('2026-07-01T00:00:00.000'),
    updatedAt: new Date('2026-07-01T00:00:00.000'),
    ...overrides,
  };
}

describe('PrismaTaskRepository', () => {
  let repository: PrismaTaskRepository;
  let prisma: PrismaMock;

  beforeEach(() => {
    prisma = {
      task: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
      },
    };

    repository = new PrismaTaskRepository(prisma as unknown as PrismaService);
  });

  it('finds all tasks', async () => {
    const prismaTask = createPrismaTask();

    prisma.task.findMany.mockResolvedValue([prismaTask]);

    await expect(repository.findAll()).resolves.toEqual([createTask()]);

    expect(prisma.task.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: 'desc' },
    });
  });
});
