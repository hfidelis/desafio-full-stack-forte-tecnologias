/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { AuthRepository } from '../auth.repository';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

const mockAuthRepository = {
  findUserByEmail: jest.fn(),
};

const mockUsersService = {
  createUser: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;
  let authRepo: typeof mockAuthRepository;
  let usersService: typeof mockUsersService;
  let jwtService: typeof mockJwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: AuthRepository, useValue: mockAuthRepository },
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    authRepo = module.get(AuthRepository);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('deve retornar o usuário se credenciais estiverem corretas', async () => {
      const password = '123456';
      const hashed = await bcrypt.hash(password, 10);
      const user = { id: 1, email: 'a@a.com', password: hashed, role: Role.USER };

      authRepo.findUserByEmail.mockResolvedValueOnce(user);

      const result = await service.validateUser('a@a.com', password);
      expect(result).toEqual(user);
      expect(authRepo.findUserByEmail).toHaveBeenCalledWith('a@a.com');
    });

    it('deve lançar UnauthorizedException se usuário não existir', async () => {
      authRepo.findUserByEmail.mockResolvedValueOnce(null);

      await expect(service.validateUser('a@a.com', '123456')).rejects.toThrow(
        new UnauthorizedException('Credenciais inválidas'),
      );
    });

    it('deve lançar UnauthorizedException se senha estiver incorreta', async () => {
      const user = { id: 1, email: 'a@a.com', password: await bcrypt.hash('123456', 10), role: Role.USER };
      authRepo.findUserByEmail.mockResolvedValueOnce(user);

      await expect(service.validateUser('a@a.com', 'wrong')).rejects.toThrow(
        new UnauthorizedException('Credenciais inválidas'),
      );
    });
  });

  describe('login', () => {
    it('deve retornar token JWT e dados do usuário', async () => {
      const user = { id: 1, email: 'a@a.com', password: 'hashed', role: Role.USER };
      jest.spyOn(service, 'validateUser').mockResolvedValueOnce(user);
      jwtService.sign.mockReturnValueOnce('token123');

      const result = await service.login('a@a.com', '123456');

      expect(result).toEqual({
        access_token: 'token123',
        user: { id: 1, email: 'a@a.com', role: Role.USER },
      });
      expect(service.validateUser).toHaveBeenCalledWith('a@a.com', '123456');
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: user.id, email: user.email, role: user.role });
    });
  });

  describe('createUser', () => {
    it('deve chamar usersService.createUser com os parâmetros corretos', async () => {
      usersService.createUser.mockResolvedValueOnce({ id: 1, email: 'a@a.com', role: Role.USER });

      const result = await service.createUser(Role.ADMIN, 'a@a.com', '123456', Role.USER);

      expect(result).toEqual({ id: 1, email: 'a@a.com', role: Role.USER });
      expect(usersService.createUser).toHaveBeenCalledWith(Role.ADMIN, 'a@a.com', '123456', Role.USER);
    });
  });
});
