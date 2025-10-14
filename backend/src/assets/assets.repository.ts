import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Asset, Prisma } from '@prisma/client';

type AssetWithRelations = Prisma.AssetGetPayload<{
  include: { type: true; status: true; employee: true };
}>;

@Injectable()
export class AssetsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.AssetCreateInput): Promise<Asset> {
    return this.prisma.asset.create({ data });
  }

  findAll(): Promise<Asset[]> {
    return this.prisma.asset.findMany({
      include: { type: true, status: true, employee: true },
    });
  }

  async findById(id: number): Promise<AssetWithRelations | null> {
    return this.prisma.asset.findUnique({
      where: { id },
      include: {
        type: true,
        status: true,
        employee: true,
      },
    });
  }

  update(
    id: number,
    data: Prisma.AssetUpdateInput,
  ): Promise<AssetWithRelations> {
    return this.prisma.asset.update({
      where: { id },
      data,
      include: { type: true, status: true, employee: true },
    });
  }

  delete(id: number): Promise<Asset> {
    return this.prisma.asset.delete({ where: { id } });
  }

  async findByEmployee(employeeId: number): Promise<Asset[]> {
    return this.prisma.asset.findMany({
      where: { employeeId },
      include: { type: true, status: true },
    });
  }

  async findNotebookByEmployee(employeeId: number): Promise<Asset | null> {
    return this.prisma.asset.findFirst({
      where: {
        employeeId,
        type: { name: 'notebook' },
      },
    });
  }
}
