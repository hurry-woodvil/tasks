import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignupDto } from './dto/signup.dto';
import { User } from 'src/users/models/user';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signup(dto: SignupDto): Promise<User> {
    return await this.usersService.createUser({
      email: dto.email,
      passwordHash: dto.password,
    });
  }
}
