import { Module } from '@nestjs/common';

import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TaskRepository } from './tasks.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaTaskRepository } from './prisma-task.repository';

@Module({
  imports: [PrismaModule],
  controllers: [TasksController],
  providers: [
    TasksService,
    {
      provide: TaskRepository,
      useClass: PrismaTaskRepository,
    },
  ],
})
export class TasksModule {}
