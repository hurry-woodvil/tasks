import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/signup.dto';
import { AuthUserResponseDto } from './dto/auth-user-response.dto';
import { SigninDto } from './dto/signin.dto';
import { User } from '../users/models/user';
import { SigninResponseDto } from './dto/signin-response.dto';
import { JwtPayload } from './models/jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto): Promise<AuthUserResponseDto> {
    const passwordHash = await argon2.hash(dto.password);

    const user = await this.usersService.createUser({
      email: dto.email,
      passwordHash,
    });

    return this.toAuthUserResponse(user);
  }

  async signin(dto: SigninDto): Promise<SigninResponseDto> {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    const matched = await argon2.verify(user.passwordHash, dto.password);

    if (!matched) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }

  async getCurrentUser(userId: string): Promise<AuthUserResponseDto> {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.toAuthUserResponse(user);
  }

  private toAuthUserResponse(user: User): AuthUserResponseDto {
    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
