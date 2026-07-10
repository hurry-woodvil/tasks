import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';

import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/signup.dto';
import { AuthUserResponseDto } from './dto/auth-user-response.dto';
import { SigninDto } from './dto/signin.dto';
import { User } from '../users/models/user';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signup(dto: SignupDto): Promise<AuthUserResponseDto> {
    const passwordHash = await argon2.hash(dto.password);

    const user = await this.usersService.createUser({
      email: dto.email,
      passwordHash,
    });

    return this.toResponseDto(user);
  }

  async signin(dto: SigninDto): Promise<AuthUserResponseDto> {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    const passwordMatches = await argon2.verify(
      user.passwordHash,
      dto.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    return this.toResponseDto(user);
  }

  private toResponseDto(user: User): AuthUserResponseDto {
    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
