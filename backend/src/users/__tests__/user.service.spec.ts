/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { UsersRepository } from '../users.repository';
import { Role } from '@prisma/client';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

const mockUsersRepository = {
  findByEmail: jest.fn(),
  createUser: jest.fn(),
  findAllExcept: jest.fn(),
  findById: jest.fn(),
  deleteUser: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;
  let repo: typeof mockUsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: mockUsersRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get(UsersRepository);
  });

  afterEach(() => jest.clearAllMocks());

  describe('criar usuário', () => {
    it('deve lançar erro se usuário não administrador tentar criar um usuário', async () => {
      await expect(
        service.createUser(Role.USER, 'test@example.com', '1234', Role.USER),
      ).rejects.toThrow(ForbiddenException);
    });

    it('deve lançar erro se o email já existir', async () => {
      repo.findByEmail.mockResolvedValueOnce({ id: 1, email: 'test@example.com' });

      await expect(
        service.createUser(Role.ADMIN, 'test@example.com', '1234', Role.USER),
      ).rejects.toThrow('Já existe um usuário com este email.');
    });

    it('deve criptografar a senha e criar o usuário com sucesso', async () => {
      repo.findByEmail.mockResolvedValueOnce(null);
      repo.createUser.mockResolvedValueOnce({
        id: 1,
        email: 'new@example.com',
        password: 'hashed_pwd',
        role: Role.USER,
      });

      const result = await service.createUser(Role.ADMIN, 'new@example.com', '1234', Role.USER);

      expect(repo.findByEmail).toHaveBeenCalledWith('new@example.com');
      expect(repo.createUser).toHaveBeenCalled();
      expect(result).not.toHaveProperty('password');
    });
  });

  describe('findAll', () => {
    it('deve lançar erro se o usuário não for administrador', async () => {
      await expect(service.findAll(Role.USER, 1)).rejects.toThrow(ForbiddenException);
    });

    it('deve retornar usuários paginados se for administrador', async () => {
      const mockPagination = { page: 1, page_size: 10, count: 1, results: [] };
      repo.findAllExcept.mockResolvedValueOnce(mockPagination);

      const result = await service.findAll(Role.ADMIN, 1, 1, 10);
      expect(result).toEqual(mockPagination);
      expect(repo.findAllExcept).toHaveBeenCalledWith(1, 1, 10);
    });
  });

  describe('findMe', () => {
    it('deve lançar erro se o usuário não for encontrado', async () => {
      repo.findById.mockResolvedValueOnce(null);

      await expect(service.findMe(99)).rejects.toThrow(NotFoundException);
    });

    it('deve retornar o usuário sem a senha', async () => {
      const mockUser = { id: 1, email: 'me@example.com', password: '123' };
      repo.findById.mockResolvedValueOnce(mockUser);

      const result = await service.findMe(1);
      expect(result).not.toHaveProperty('password');
      expect(result.email).toBe('me@example.com');
    });
  });

  describe('deleteUser', () => {
    it('deve lançar erro se usuário não administrador tentar deletar', async () => {
      await expect(service.deleteUser(Role.USER, 1)).rejects.toThrow(ForbiddenException);
    });

    it('deve deletar o usuário com sucesso', async () => {
      const mockUser = { id: 1, email: 'a@a.com', password: '123' };
      repo.deleteUser.mockResolvedValueOnce(mockUser);

      const result = await service.deleteUser(Role.ADMIN, 1);
      expect(result).not.toHaveProperty('password');
      expect(result.id).toBe(1);
    });
  });
});
