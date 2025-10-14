import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Employee } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { CreateEmployeeDto } from './dto/create-employee.dto';

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

  findAll(): Promise<Employee[]> {
    return this.prisma.employee.findMany({
      include: { company: true, assets: true },
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
      include: { assets: true },
    });
  }

  update(id: number, data: Prisma.EmployeeUpdateInput): Promise<Employee> {
    return this.prisma.employee.update({ where: { id }, data });
  }

  delete(id: number): Promise<Employee> {
    return this.prisma.employee.delete({ where: { id } });
  }
}
