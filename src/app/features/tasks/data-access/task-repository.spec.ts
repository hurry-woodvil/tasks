import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { Task } from '@tasks/models/task';
import { TaskRepository } from '@tasks/data-access/task-repository';

describe('TaskRepository', () => {
  let repository: TaskRepository;
  let httpTesting: HttpTestingController;

  const apiUrl = 'http://localhost:3000/tasks';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), TaskRepository],
    });

    repository = TestBed.inject(TaskRepository);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('finds all tasks', () => {
    const tasks: Task[] = [
      {
        id: '1',
        title: 'Angularを学ぶ',
        status: 'todo',
        dueDate: null,
        createdAt: '2026-07-01T00:00:00.000Z',
        updatedAt: '2026-07-01T00:00:00.000Z',
      },
    ];

    repository.findAll().subscribe((result) => {
      expect(result).toEqual(tasks);
    });

    const req = httpTesting.expectOne(apiUrl);

    expect(req.request.method).toBe('GET');

    req.flush(tasks);
  });

  it('creates a task', () => {
    const task: Task = {
      id: '1',
      title: 'Angularを学ぶ',
      status: 'todo',
      dueDate: null,
      createdAt: '2026-07-01T00:00:00.000',
      updatedAt: '2026-07-01T00:00:00.000',
    };

    repository.create(task).subscribe((result) => {
      expect(result).toEqual(task);
    });

    const req = httpTesting.expectOne(apiUrl);

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(task);

    req.flush(task);
  });

  it('updates a task', () => {
    const task: Task = {
      id: '1',
      title: 'Angular Signalsを学ぶ',
      status: 'done',
      dueDate: '2026-07-10',
      createdAt: '2026-07-01T00:00:00.000',
      updatedAt: '2026-07-02T00:00:00.000',
    };

    repository.update(task).subscribe((result) => {
      expect(result).toEqual(task);
    });

    const req = httpTesting.expectOne(`${apiUrl}/1`);

    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(task);

    req.flush(task);
  });

  it('deletes a task', () => {
    repository.delete('1').subscribe((result) => {
      expect(result).toBeNull();
    });

    const req = httpTesting.expectOne(`${apiUrl}/1`);

    expect(req.request.method).toBe('DELETE');

    req.flush(null);
  });
});
