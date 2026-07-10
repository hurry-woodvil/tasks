import { ConflictException, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './models/user';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async findById(id: string): Promise<User | undefined> {
    return await this.userRepository.findById(id);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findByEmail(email);
  }

  async createUser(params: {
    email: string;
    passwordHash: string;
  }): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(params.email);

    if (existingUser) {
      throw new ConflictException('Email is already used');
    }

    const now = new Date();

    return await this.userRepository.create({
      id: crypto.randomUUID(),
      email: params.email,
      passwordHash: params.passwordHash,
      createdAt: now,
      updatedAt: now,
    });
  }
}
