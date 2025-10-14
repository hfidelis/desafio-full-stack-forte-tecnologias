import { Injectable, NotFoundException } from '@nestjs/common';
import { CompaniesRepository } from './companies.repository';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(private readonly companiesRepo: CompaniesRepository) {}

  async create(dto: CreateCompanyDto) {
    return this.companiesRepo.create(dto);
  }

  async findAll() {
    return this.companiesRepo.findAll();
  }

  async findById(id: number) {
    const company = await this.companiesRepo.findById(id);
    if (!company) throw new NotFoundException('Empresa não encontrada');
    return company;
  }

  async update(id: number, dto: UpdateCompanyDto) {
    return this.companiesRepo.update(id, dto);
  }

  async delete(id: number) {
    return this.companiesRepo.delete(id);
  }
}
