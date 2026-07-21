import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { User } from '../users/models/user';
import { Test, TestingModule } from '@nestjs/testing';
import * as argon2 from 'argon2';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: jest.Mocked<Pick<UsersService, 'createUser' | 'findByEmail' | 'findById'>>;
  let jwtService: jest.Mocked<Pick<JwtService, 'signAsync'>>;

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
            findById: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  describe('signin', () => {
    it('returns an access token when credentials are valid', async () => {
      const password = 'password123';
      const passwordHash = await argon2.hash(password);

      usersService.findByEmail.mockResolvedValue({
        id: 'user-id',
        email: 'test@example.com',
        passwordHash,
        createdAt: new Date('2026-07-13T00:00:00.000Z'),
        updatedAt: new Date('2026-07-13T00:00:00.000Z'),
      });

      jwtService.signAsync.mockResolvedValue('dummy-access-token');

      await expect(authService.signin({ email: 'test@example.com', password })).resolves.toEqual({
        accessToken: 'dummy-access-token',
      });

      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: 'user-id',
        email: 'test@example.com',
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
