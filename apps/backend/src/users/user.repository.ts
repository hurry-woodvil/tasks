import { User } from './models/user';

export abstract class UserRepository {
  abstract findById(id: string): Promise<User | undefined>;

  abstract findByEmail(email: string): Promise<User | undefined>;

  abstract create(user: User): Promise<User>;
}
