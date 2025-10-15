import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Employee } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { paginate } from 'src/common/pagination/pagination.util';
import { PaginatedResponseDto } from 'src/common/pagination/pagination-response.dto';

@Injectable()
export class EmployeesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateEmployeeDto): Promise<Employee> {
    return this.prisma.employee.create({
      data: {
        name: data.name,
        email: data.email,
        cpf: data.cpf,
        company: { connect: { id: data.companyId } },
      },
    });
  }

  findAll(
    page: number = 1,
    page_size: number = 10,
  ): Promise<PaginatedResponseDto<Employee>> {
    return paginate<Employee>(this.prisma.employee, {
      page,
      page_size,
      include: { company: false, assets: false },
    });
  }

  findById(id: number): Promise<Employee | null> {
    return this.prisma.employee.findUnique({
      where: { id },
      include: { company: true, assets: true },
    });
  }

  findByCompany(companyId: number): Promise<Employee[]> {
    return this.prisma.employee.findMany({
      where: { companyId },
      include: { assets: false, company: false },
    });
  }

  update(id: number, data: Prisma.EmployeeUpdateInput): Promise<Employee> {
    return this.prisma.employee.update({ where: { id }, data });
  }

  delete(id: number): Promise<Employee> {
    return this.prisma.employee.delete({ where: { id } });
  }
}
