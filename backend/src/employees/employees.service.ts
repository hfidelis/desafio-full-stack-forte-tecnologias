import { Injectable, NotFoundException } from '@nestjs/common';
import { EmployeesRepository } from './employees.repository';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(private readonly employeesRepo: EmployeesRepository) {}

  async create(dto: CreateEmployeeDto) {
    return this.employeesRepo.create(dto);
  }

  async findAll() {
    return this.employeesRepo.findAll();
  }

  async findById(id: number) {
    const employee = await this.employeesRepo.findById(id);
    if (!employee) throw new NotFoundException('Employee not found');
    return employee;
  }

  async findByCompany(companyId: number) {
    return this.employeesRepo.findByCompany(companyId);
  }

  async update(id: number, dto: UpdateEmployeeDto) {
    const employee = await this.employeesRepo.findById(id);
    if (!employee) throw new NotFoundException('Employee not found');
    return this.employeesRepo.update(id, dto);
  }

  async delete(id: number) {
    const employee = await this.employeesRepo.findById(id);
    if (!employee) throw new NotFoundException('Employee not found');
    return this.employeesRepo.delete(id);
  }
}
