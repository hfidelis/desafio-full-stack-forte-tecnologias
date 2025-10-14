import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { AssetsRepository } from './assets.repository';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { Asset, Prisma } from '@prisma/client';

@Injectable()
export class AssetsService {
  constructor(private readonly assetsRepo: AssetsRepository) {}

  async create(dto: CreateAssetDto): Promise<Asset> {
    return this.assetsRepo.create({
      name: dto.name,
      type: { connect: { id: dto.typeId } },
      status: { connect: { id: dto.statusId } },
    });
  }

  async findAll(): Promise<Asset[]> {
    return this.assetsRepo.findAll();
  }

  async findById(id: number): Promise<Asset> {
    const asset = await this.assetsRepo.findById(id);
    if (!asset) throw new NotFoundException('Asset not found');
    return asset;
  }

  async update(id: number, dto: UpdateAssetDto): Promise<Asset> {
    const asset = await this.assetsRepo.findById(id);
    if (!asset) throw new NotFoundException('Asset not found');

    const data: Prisma.AssetUpdateInput = {};

    if (dto.name) data.name = dto.name;
    if (dto.typeId) data.type = { connect: { id: dto.typeId } };
    if (dto.statusId) data.status = { connect: { id: dto.statusId } };

    return this.assetsRepo.update(id, data);
  }

  async delete(id: number): Promise<Asset> {
    const asset = await this.assetsRepo.findById(id);
    if (!asset) throw new NotFoundException('Ativo não encontrado');
    return this.assetsRepo.delete(id);
  }

  async assignToEmployee(assetId: number, employeeId: number): Promise<Asset> {
    const asset = await this.assetsRepo.findById(assetId);
    if (!asset) throw new NotFoundException('Ativo não encontrado');
    if (asset.employeeId)
      throw new BadRequestException('Ativo já está associado a um funcionário');
    if (asset.status.name !== 'available')
      throw new BadRequestException(
        'Ativo não está disponível para associação',
      );

    if (asset.type.name === 'notebook') {
      const hasNotebook =
        await this.assetsRepo.findNotebookByEmployee(employeeId);

      if (hasNotebook) {
        throw new BadRequestException(
          'O Funcionário já possui um notebook associado',
        );
      }
    }

    return this.assetsRepo.update(assetId, {
      employee: { connect: { id: employeeId } },
      status: { connect: { name: 'allocated' } },
    });
  }

  async unassign(assetId: number): Promise<Asset> {
    const asset = await this.assetsRepo.findById(assetId);
    if (!asset) throw new NotFoundException('Ativo não encontrado');
    if (!asset.employeeId) {
      throw new BadRequestException(
        'O Ativo não está associado a um funcionário',
      );
    }

    return this.assetsRepo.update(assetId, {
      employee: { disconnect: true },
      status: { connect: { name: 'available' } },
    });
  }

  async findByEmployee(employeeId: number): Promise<Asset[]> {
    return this.assetsRepo.findByEmployee(employeeId);
  }
}
