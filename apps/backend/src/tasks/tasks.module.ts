import { Module } from '@nestjs/common';

import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { InMemoryTaskRepository } from './in-memory-task.repository';
import { TaskRepository } from './task.repository';

@Module({
  controllers: [TasksController],
  providers: [
    TasksService,
    {
      provide: TaskRepository,
      useClass: InMemoryTaskRepository,
    },
  ],
})
export class TasksModule {}
