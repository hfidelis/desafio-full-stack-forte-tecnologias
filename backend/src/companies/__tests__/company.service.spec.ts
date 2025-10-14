/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesService } from '../companies.service';
import { CompaniesRepository } from '../companies.repository';
import { NotFoundException } from '@nestjs/common';
import { Company } from '@prisma/client';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { CreateCompanyDto } from '../dto/create-company.dto';

const mockCompaniesRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('CompaniesService', () => {
  let service: CompaniesService;
  let repo: typeof mockCompaniesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        { provide: CompaniesRepository, useValue: mockCompaniesRepository },
      ],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
    repo = module.get(CompaniesRepository);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('deve criar uma empresa com sucesso', async () => {
      const dto = { name: 'Forte Tecnologias', cnpj: '12.345.678/0001-99' };
      const mockCompany = { id: 1, ...dto } as Company;
      repo.create.mockResolvedValueOnce(mockCompany);

      const result = await service.create(dto as CreateCompanyDto);
      expect(result).toEqual(mockCompany);
      expect(repo.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('deve retornar uma lista paginada de empresas', async () => {
      const mockPaginated = {
        page: 1,
        page_size: 10,
        count: 2,
        results: [
          { id: 1, name: 'Forte Tecnologias', cnpj: '12.345.678/0001-99' },
          { id: 2, name: 'Outra Empresa', cnpj: '98.765.432/0001-00' },
        ],
      };
      repo.findAll.mockResolvedValueOnce(mockPaginated);

      const result = await service.findAll(1, 10);
      expect(result).toEqual(mockPaginated);
      expect(repo.findAll).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('findById', () => {
    it('deve retornar a empresa quando encontrada', async () => {
      const mockCompany = { id: 1, name: 'Forte Tecnologias', cnpj: '12.345.678/0001-99' } as Company;
      repo.findById.mockResolvedValueOnce(mockCompany);

      const result = await service.findById(1);
      expect(result).toEqual(mockCompany);
      expect(repo.findById).toHaveBeenCalledWith(1);
    });

    it('deve lançar erro se a empresa não for encontrada', async () => {
      repo.findById.mockResolvedValueOnce(null);

      await expect(service.findById(99)).rejects.toThrow(
        new NotFoundException('Empresa não encontrada'),
      );
    });
  });

  describe('update', () => {
    it('deve atualizar uma empresa existente', async () => {
      const dto = { name: 'Forte Atualizada', cnpj: '12.345.678/0001-99' };
      const updated = { id: 1, ...dto } as Company;

      repo.update.mockResolvedValueOnce(updated);

      const result = await service.update(1, dto as UpdateCompanyDto);
      expect(result).toEqual(updated);
      expect(repo.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('delete', () => {
    it('deve deletar uma empresa existente', async () => {
      const existing = { id: 1, name: 'Forte Tecnologias', cnpj: '12.345.678/0001-99' } as Company;
      repo.delete.mockResolvedValueOnce(existing);

      const result = await service.delete(1);
      expect(result).toEqual(existing);
      expect(repo.delete).toHaveBeenCalledWith(1);
    });
  });
});
