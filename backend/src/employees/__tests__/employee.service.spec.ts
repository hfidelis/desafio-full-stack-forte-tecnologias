/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesService } from '../employees.service';
import { EmployeesRepository } from '../employees.repository';
import { NotFoundException } from '@nestjs/common';
import { Employee } from '@prisma/client';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';

const mockEmployeesRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  findByCompany: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('EmployeesService', () => {
  let service: EmployeesService;
  let repo: typeof mockEmployeesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeesService,
        { provide: EmployeesRepository, useValue: mockEmployeesRepository },
      ],
    }).compile();

    service = module.get<EmployeesService>(EmployeesService);
    repo = module.get(EmployeesRepository);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('deve criar um funcionário com sucesso', async () => {
      const dto = { name: 'João', companyId: 1, email: 'joao@example.com' };
      const mockEmployee = { id: 1, name: 'João', companyId: 1, email: 'joao@example.com' } as Employee;
      repo.create.mockResolvedValueOnce(mockEmployee);

      const result = await service.create(dto as CreateEmployeeDto);
      expect(result).toEqual(mockEmployee);
      expect(repo.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('deve retornar uma lista paginada de funcionários', async () => {
      const mockPaginated = {
        page: 1,
        page_size: 10,
        count: 2,
        results: [
          { id: 1, name: 'João', companyId: 1, email: 'joao@example.com' },
          { id: 2, name: 'Maria', companyId: 1, email: 'maria@example.com' },
        ],
      };
      repo.findAll.mockResolvedValueOnce(mockPaginated);

      const result = await service.findAll(1, 10);
      expect(result).toEqual(mockPaginated);
      expect(repo.findAll).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('findById', () => {
    it('deve retornar o funcionário quando encontrado', async () => {
      const mockEmployee = { id: 1, name: 'João', companyId: 1, email: 'joao@example.com' } as Employee;
      repo.findById.mockResolvedValueOnce(mockEmployee);

      const result = await service.findById(1);
      expect(result).toEqual(mockEmployee);
      expect(repo.findById).toHaveBeenCalledWith(1);
    });

    it('deve lançar erro se o funcionário não for encontrado', async () => {
      repo.findById.mockResolvedValueOnce(null);

      await expect(service.findById(99)).rejects.toThrow(
        new NotFoundException('Funcionário não encontrado'),
      );
    });
  });

  describe('findByCompany', () => {
    it('deve retornar os funcionários de uma empresa específica', async () => {
      const mockEmployees = [
        { id: 1, name: 'João', companyId: 1, email: 'joao@example.com' },
        { id: 2, name: 'Maria', companyId: 1, email: 'maria@example.com' },
      ];
      repo.findByCompany.mockResolvedValueOnce(mockEmployees);

      const result = await service.findByCompany(1);
      expect(result).toEqual(mockEmployees);
      expect(repo.findByCompany).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('deve atualizar um funcionário existente', async () => {
      const dto = { name: 'João Atualizado' };
      const existing = { id: 1, name: 'João', companyId: 1, email: 'joao@example.com' } as Employee;
      const updated = { id: 1, name: 'João Atualizado', companyId: 1, email: 'joao@example.com' } as Employee;

      repo.findById.mockResolvedValueOnce(existing);
      repo.update.mockResolvedValueOnce(updated);

      const result = await service.update(1, dto as UpdateEmployeeDto);
      expect(result).toEqual(updated);
      expect(repo.findById).toHaveBeenCalledWith(1);
      expect(repo.update).toHaveBeenCalledWith(1, dto);
    });

    it('deve lançar erro se o funcionário não existir ao atualizar', async () => {
      repo.findById.mockResolvedValueOnce(null);
      await expect(service.update(99, { name: 'Novo' } as UpdateEmployeeDto)).rejects.toThrow(
        new NotFoundException('Funcionário não encontrado'),
      );
    });
  });

  describe('delete', () => {
    it('deve deletar um funcionário existente', async () => {
      const existing = { id: 1, name: 'João', companyId: 1, email: 'joao@example.com' } as Employee;
      repo.findById.mockResolvedValueOnce(existing);
      repo.delete.mockResolvedValueOnce(existing);

      const result = await service.delete(1);
      expect(result).toEqual(existing);
      expect(repo.delete).toHaveBeenCalledWith(1);
    });

    it('deve lançar erro se o funcionário não existir ao deletar', async () => {
      repo.findById.mockResolvedValueOnce(null);
      await expect(service.delete(99)).rejects.toThrow(
        new NotFoundException('Funcionário não encontrado'),
      );
    });
  });
});
