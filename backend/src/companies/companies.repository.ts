import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Company } from '@prisma/client';
import { Prisma } from '@prisma/client';

@Injectable()
export class CompaniesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.CompanyCreateInput): Promise<Company> {
    return this.prisma.company.create({ data });
  }

  findAll(): Promise<Company[]> {
    return this.prisma.company.findMany();
  }

  findById(id: number): Promise<Company | null> {
    return this.prisma.company.findUnique({
      where: { id },
      include: { employees: true },
    });
  }

  update(id: number, data: Prisma.CompanyUpdateInput): Promise<Company> {
    return this.prisma.company.update({ where: { id }, data });
  }

  delete(id: number): Promise<Company> {
    return this.prisma.company.delete({ where: { id } });
  }
}
