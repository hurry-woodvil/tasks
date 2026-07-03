import { Provider } from '@angular/core';

import { TASK_REPOSITORY } from './task-repository';
import { JsonServerTaskRepository } from './json-server-task-repository';

export function provideTaskRepository(): Provider {
  return {
    provide: TASK_REPOSITORY,
    useClass: JsonServerTaskRepository,
  };
}
