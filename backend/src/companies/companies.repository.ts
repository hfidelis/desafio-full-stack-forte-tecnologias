import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Company } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { paginate } from 'src/common/pagination/pagination.util';
import { PaginatedResponseDto } from 'src/common/pagination/pagination-response.dto';

@Injectable()
export class CompaniesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.CompanyCreateInput): Promise<Company> {
    return this.prisma.company.create({ data });
  }

  findAll(
    page: number = 1,
    page_size: number = 10,
  ): Promise<PaginatedResponseDto<Company>> {
    return paginate<Company>(this.prisma.company, {
      page,
      page_size,
      include: { employees: false },
    });
  }

  findById(id: number): Promise<Company | null> {
    return this.prisma.company.findUnique({
      where: { id },
      include: { employees: false },
    });
  }

  update(id: number, data: Prisma.CompanyUpdateInput): Promise<Company> {
    return this.prisma.company.update({ where: { id }, data });
  }

  delete(id: number): Promise<Company> {
    return this.prisma.company.delete({ where: { id } });
  }
}
