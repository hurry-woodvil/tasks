import { TestBed } from '@angular/core/testing';

import { JsonServerTaskRepository } from './json-server-task-repository';
import { MockTaskRepository } from './mock-task-repository';
import { LocalStorageTaskRepository } from './local-storage-task-repository';
import { provideTaskRepository } from './task-repository.provider';
import { TASK_REPOSITORY } from './task-repository';

describe('provideTaskRepository', () => {
  it('provides JsonServerTaskRepository by default', () => {
    TestBed.configureTestingModule({
      providers: [provideTaskRepository()],
    });

    const repository = TestBed.inject(TASK_REPOSITORY);

    expect(repository).toBeInstanceOf(JsonServerTaskRepository);
  });

  it('provides JsonServerTaskRepository when type is json-server', () => {
    TestBed.configureTestingModule({
      providers: [provideTaskRepository('json-server')],
    });

    const repository = TestBed.inject(TASK_REPOSITORY);

    expect(repository).toBeInstanceOf(JsonServerTaskRepository);
  });

  it('provides MockServerTaskRepository when type is mock', () => {
    TestBed.configureTestingModule({
      providers: [provideTaskRepository('mock')],
    });

    const repository = TestBed.inject(TASK_REPOSITORY);

    expect(repository).toBeInstanceOf(MockTaskRepository);
  });

  it('provides LocalStorageTaskRepository when type is local-storage', () => {
    TestBed.configureTestingModule({
      providers: [provideTaskRepository('local-storage')],
    });

    const repository = TestBed.inject(TASK_REPOSITORY);

    expect(repository).toBeInstanceOf(LocalStorageTaskRepository);
  });
});
