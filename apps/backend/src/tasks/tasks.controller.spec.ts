import { Test, TestingModule } from '@nestjs/testing';

import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './models/task';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

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

describe('TasksController', () => {
  const service = {
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    deleteAll: jest.fn(),
  };

  let controller: TasksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get(TasksController);
  });

  it('finds all tasks', async () => {
    const tasks = [createTask()];

    service.findAll.mockResolvedValue(tasks);

    await expect(controller.findAll()).resolves.toEqual(tasks);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('creates a task', async () => {
    const dto: CreateTaskDto = {
      title: 'Angularを学ぶ',
      dueDate: null,
    };

    const task = createTask();

    service.create.mockResolvedValue(task);

    await expect(controller.create(dto)).resolves.toEqual(task);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('updates a task', async () => {
    const dto: UpdateTaskDto = {
      title: 'Angular Signalsを学ぶ',
      status: 'done',
      dueDate: '2026-07-10',
    };

    const task = createTask({
      title: dto.title,
      status: dto.status,
      dueDate: dto.dueDate,
    });

    service.update.mockResolvedValue(task);

    await expect(controller.update('1', dto)).resolves.toEqual(task);
    expect(service.update).toHaveBeenCalledWith('1', dto);
  });

  it('deletes a task', async () => {
    await controller.delete('1');

    expect(service.delete).toHaveBeenCalledWith('1');
  });

  it('deletes all tasks', async () => {
    await controller.deleteAll();

    expect(service.deleteAll).toHaveBeenCalled();
  });
});
