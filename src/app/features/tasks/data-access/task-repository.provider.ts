import { Provider } from '@angular/core';

import { TASK_REPOSITORY } from './task-repository';
import { JsonServerTaskRepository } from './json-server-task-repository';
import { MockTaskRepository } from './mock-task-repository';
import { LocalStorageTaskRepository } from './local-storage-task-repository';

type TaskRepositoryType = 'json-server' | 'mock' | 'local-storage';

export function provideTaskRepository(type: TaskRepositoryType = 'json-server'): Provider {
  return {
    provide: TASK_REPOSITORY,
    useClass:
      type === 'mock'
        ? MockTaskRepository
        : type === 'local-storage'
          ? LocalStorageTaskRepository
          : JsonServerTaskRepository,
  };
}
