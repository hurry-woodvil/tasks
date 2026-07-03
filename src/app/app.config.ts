import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { TASK_REPOSITORY } from '@tasks/data-access/task-repository';
import { JsonServerTaskRepository } from '@tasks/data-access/json-server-task-repository';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: TASK_REPOSITORY,
      useClass: JsonServerTaskRepository,
    },
  ],
};
