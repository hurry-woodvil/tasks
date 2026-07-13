import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { PrismaService } from '../prisma/prisma.service';
import { User } from './models/user';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | undefined> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user ?? undefined;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user ?? undefined;
  }

  async create(user: User): Promise<User> {
    return await this.prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        passwordHash: user.passwordHash,
      },
    });
  }
}
