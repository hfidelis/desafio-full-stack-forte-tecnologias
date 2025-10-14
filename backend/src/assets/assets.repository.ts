import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Asset, Prisma } from '@prisma/client';
import { PaginatedResponseDto } from 'src/common/pagination/pagination-response.dto';
import { paginate } from 'src/common/pagination/pagination.util';

type AssetWithRelations = Prisma.AssetGetPayload<{
  include: { type: true; status: true; employee: true };
}>;

@Injectable()
export class AssetsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.AssetCreateInput): Promise<Asset> {
    return this.prisma.asset.create({ data });
  }

  findAll(
    page: number = 1,
    page_size: number = 10,
  ): Promise<PaginatedResponseDto<Asset>> {
    return paginate(this.prisma.asset, {
      include: { type: true, status: true, employee: true },
      page,
      page_size,
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
