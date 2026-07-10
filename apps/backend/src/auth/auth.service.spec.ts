import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { User } from '../users/models/user';
import { Test, TestingModule } from '@nestjs/testing';
import * as argon2 from 'argon2';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: jest.Mocked<UsersService>;

  const user: User = {
    id: 'user-id',
    email: 'test@example.com',
    passwordHash: '',
    createdAt: new Date('2026-07-10T00:00:00.000Z'),
    updatedAt: new Date('2026-07-10T00:00:00.000Z'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn(),
            findByEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get(AuthService);
    usersService = module.get(UsersService);
  });

  describe('signin', () => {
    it('returns user response when credentials are valid', async () => {
      const password = 'password123';
      const passwordHash = await argon2.hash(password);

      usersService.findByEmail.mockResolvedValue({
        ...user,
        passwordHash,
      });

      await expect(
        authService.signin({ email: user.email, password }),
      ).resolves.toEqual({
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    });

    it('throws UnauthorizedException when user does not exist', async () => {
      usersService.findByEmail.mockResolvedValue(undefined);

      await expect(
        authService.signin({
          email: 'missing@example.com',
          password: 'password123',
        }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('throws UnauthorizedException when password is incorrect', async () => {
      const passwordHash = await argon2.hash('correct-password');

      usersService.findByEmail.mockResolvedValue({
        ...user,
        passwordHash,
      });

      await expect(
        authService.signin({ email: user.email, password: 'wrong-password' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });
});
