import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

import { UsersService } from 'src/users/users.service';
import { SignupDto } from './dto/signup.dto';
import { AuthUserResponseDto } from './dto/auth-user-response.dto';
import { SigninDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signup(dto: SignupDto): Promise<AuthUserResponseDto> {
    const passwordHash = await argon2.hash(dto.password);

    const user = await this.usersService.createUser({
      email: dto.email,
      passwordHash,
    });

    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  signin(dto: SigninDto): SigninDto {
    return dto;
  }
}
