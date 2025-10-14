/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { AssetsService } from '../assets.service';
import { AssetsRepository } from '../assets.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Asset } from '@prisma/client';
import { CreateAssetDto } from '../dto/create-asset.dto';
import { UpdateAssetDto } from '../dto/update-asset.dto';

const mockAssetsRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findNotebookByEmployee: jest.fn(),
  findByEmployee: jest.fn(),
};

describe('AssetsService', () => {
  let service: AssetsService;
  let repo: typeof mockAssetsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssetsService,
        { provide: AssetsRepository, useValue: mockAssetsRepository },
      ],
    }).compile();

    service = module.get<AssetsService>(AssetsService);
    repo = module.get(AssetsRepository);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('deve criar um ativo com sucesso', async () => {
      const dto = { name: 'Notebook', typeId: 1, statusId: 1 };
      const mockAsset = { id: 1, ...dto } as Asset;

      repo.create.mockResolvedValueOnce(mockAsset);

      const result = await service.create(dto as CreateAssetDto);
      expect(result).toEqual(mockAsset);
      expect(repo.create).toHaveBeenCalledWith({
        name: dto.name,
        type: { connect: { id: dto.typeId } },
        status: { connect: { id: dto.statusId } },
      });
    });
  });

  describe('findAll', () => {
    it('deve retornar ativos paginados', async () => {
      const mockPaginated = { page: 1, page_size: 10, count: 2, results: [] };
      repo.findAll.mockResolvedValueOnce(mockPaginated);

      const result = await service.findAll(1, 10);
      expect(result).toEqual(mockPaginated);
      expect(repo.findAll).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('findById', () => {
    it('deve retornar ativo existente', async () => {
      const mockAsset = { id: 1, name: 'Notebook' } as Asset;
      repo.findById.mockResolvedValueOnce(mockAsset);

      const result = await service.findById(1);
      expect(result).toEqual(mockAsset);
    });

    it('deve lançar NotFoundException se não existir', async () => {
      repo.findById.mockResolvedValueOnce(null);

      await expect(service.findById(99)).rejects.toThrow(
        new NotFoundException('Ativo não encontrado'),
      );
    });
  });

  describe('update', () => {
    it('deve atualizar ativo existente', async () => {
      const dto = { name: 'Monitor' };
      const existing = { id: 1, name: 'Notebook' } as Asset;
      const updated = { id: 1, name: 'Monitor' } as Asset;

      repo.findById.mockResolvedValueOnce(existing);
      repo.update.mockResolvedValueOnce(updated);

      const result = await service.update(1, dto as UpdateAssetDto);
      expect(result).toEqual(updated);
      expect(repo.update).toHaveBeenCalledWith(1, { name: 'Monitor' });
    });

    it('deve lançar NotFoundException se ativo não existir', async () => {
      repo.findById.mockResolvedValueOnce(null);

      await expect(service.update(99, {} as UpdateAssetDto)).rejects.toThrow(
        new NotFoundException('Ativo não encontrado'),
      );
    });
  });

  describe('delete', () => {
    it('deve deletar ativo existente', async () => {
      const existing = { id: 1, name: 'Notebook' } as Asset;
      repo.findById.mockResolvedValueOnce(existing);
      repo.delete.mockResolvedValueOnce(existing);

      const result = await service.delete(1);
      expect(result).toEqual(existing);
      expect(repo.delete).toHaveBeenCalledWith(1);
    });

    it('deve lançar NotFoundException se não existir', async () => {
      repo.findById.mockResolvedValueOnce(null);

      await expect(service.delete(99)).rejects.toThrow(
        new NotFoundException('Ativo não encontrado'),
      );
    });
  });

  describe('assignToEmployee', () => {
    const employeeId = 1;

    it('deve associar ativo disponível a funcionário', async () => {
      const asset = { id: 1, name: 'Notebook', employeeId: null, status: { name: 'available' }, type: { name: 'notebook' } } as any;
      repo.findById.mockResolvedValueOnce(asset);
      repo.findNotebookByEmployee.mockResolvedValueOnce(null);
      repo.update.mockResolvedValueOnce({ ...asset, employeeId, status: { name: 'allocated' } });

      const result = await service.assignToEmployee(1, employeeId);
      expect(result.employeeId).toBe(employeeId);
      expect(repo.update).toHaveBeenCalled();
    });

    it('deve lançar BadRequestException se ativo já estiver associado', async () => {
      const asset = { id: 1, employeeId: 2, status: { name: 'available' }, type: { name: 'notebook' } } as any;
      repo.findById.mockResolvedValueOnce(asset);

      await expect(service.assignToEmployee(1, employeeId)).rejects.toThrow(
        new BadRequestException('Ativo já está associado a um funcionário'),
      );
    });

    it('deve lançar BadRequestException se ativo não estiver disponível', async () => {
      const asset = { id: 1, employeeId: null, status: { name: 'allocated' }, type: { name: 'notebook' } } as any;
      repo.findById.mockResolvedValueOnce(asset);

      await expect(service.assignToEmployee(1, employeeId)).rejects.toThrow(
        new BadRequestException('Ativo não está disponível para associação'),
      );
    });

    it('deve lançar BadRequestException se funcionário já tiver notebook', async () => {
      const asset = { id: 1, employeeId: null, status: { name: 'available' }, type: { name: 'notebook' } } as any;
      repo.findById.mockResolvedValueOnce(asset);
      repo.findNotebookByEmployee.mockResolvedValueOnce({ id: 2 });

      await expect(service.assignToEmployee(1, employeeId)).rejects.toThrow(
        new BadRequestException('O Funcionário já possui um notebook associado'),
      );
    });
  });

  describe('unassign', () => {
    it('deve desassociar ativo de funcionário', async () => {
      const asset = { id: 1, employeeId: 1 } as any;
      repo.findById.mockResolvedValueOnce(asset);
      repo.update.mockResolvedValueOnce({ ...asset, employeeId: null });

      const result = await service.unassign(1);
      expect(result.employeeId).toBe(null);
      expect(repo.update).toHaveBeenCalled();
    });

    it('deve lançar BadRequestException se ativo não estiver associado', async () => {
      const asset = { id: 1, employeeId: null } as any;
      repo.findById.mockResolvedValueOnce(asset);

      await expect(service.unassign(1)).rejects.toThrow(
        new BadRequestException('O Ativo não está associado a um funcionário'),
      );
    });

    it('deve lançar NotFoundException se ativo não existir', async () => {
      repo.findById.mockResolvedValueOnce(null);

      await expect(service.unassign(99)).rejects.toThrow(
        new NotFoundException('Ativo não encontrado'),
      );
    });
  });

  describe('findByEmployee', () => {
    it('deve retornar todos os ativos de um funcionário', async () => {
      const assets = [{ id: 1 }, { id: 2 }] as Asset[];
      repo.findByEmployee.mockResolvedValueOnce(assets);

      const result = await service.findByEmployee(1);
      expect(result).toEqual(assets);
      expect(repo.findByEmployee).toHaveBeenCalledWith(1);
    });
  });
});
