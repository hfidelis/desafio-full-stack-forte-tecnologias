import { Injectable, NotFoundException } from '@nestjs/common';
import { EmployeesRepository } from './employees.repository';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PaginatedResponseDto } from 'src/common/pagination/pagination-response.dto';
import { Employee } from '@prisma/client';

@Injectable()
export class EmployeesService {
  constructor(private readonly employeesRepo: EmployeesRepository) {}

  async create(dto: CreateEmployeeDto) {
    try {
      return this.employeesRepo.create(dto);
    } catch (error: any) {
      if ('code' in error && error.code === 'P2002') {
        throw new NotFoundException(
          'Já existe um funcionário com este CPF ou email',
        );
      }
      throw error;
    }
  }

  async findAll(
    page: number = 1,
    page_size: number = 10,
  ): Promise<PaginatedResponseDto<Employee>> {
    return this.employeesRepo.findAll(page, page_size);
  }

  async findById(id: number) {
    const employee = await this.employeesRepo.findById(id);
    if (!employee) throw new NotFoundException('Funcionário não encontrado');
    return employee;
  }

  async findByCompany(companyId: number) {
    return this.employeesRepo.findByCompany(companyId);
  }

  async update(id: number, dto: UpdateEmployeeDto) {
    const employee = await this.employeesRepo.findById(id);
    if (!employee) throw new NotFoundException('Funcionário não encontrado');
    try {
      return this.employeesRepo.update(id, dto);
    } catch (error: any) {
      if ('code' in error && error.code === 'P2002') {
        throw new NotFoundException(
          'Já existe um funcionário com este CPF ou email',
        );
      }
      throw error;
    }
  }

  async delete(id: number) {
    const employee = await this.employeesRepo.findById(id);
    if (!employee) throw new NotFoundException('Funcionário não encontrado');
    return this.employeesRepo.delete(id);
  }
}
