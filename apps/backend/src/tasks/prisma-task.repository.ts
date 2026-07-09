import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { Task } from './models/task';
import { TaskRepository } from './tasks.repository';

@Injectable()
export class PrismaTaskRepository implements TaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Task[]> {
    return await this.prisma.task.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<Task | undefined> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    return task ?? undefined;
  }

  async create(task: Task): Promise<Task> {
    return await this.prisma.task.create({
      data: task,
    });
  }

  async update(task: Task): Promise<Task> {
    return await this.prisma.task.update({
      where: { id: task.id },
      data: {
        title: task.title,
        status: task.status,
        dueDate: task.dueDate,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.task.delete({
      where: { id },
    });
  }

  async deleteAll(): Promise<void> {
    await this.prisma.task.deleteMany();
  }
}
