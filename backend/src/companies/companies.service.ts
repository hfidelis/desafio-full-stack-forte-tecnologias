import { Injectable, NotFoundException } from '@nestjs/common';
import { CompaniesRepository } from './companies.repository';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PaginatedResponseDto } from 'src/common/pagination/pagination-response.dto';
import { Company } from '@prisma/client';
import { cnpj } from 'cpf-cnpj-validator';
import { ConflictException } from '@nestjs/common';

@Injectable()
export class CompaniesService {
  constructor(private readonly companiesRepo: CompaniesRepository) {}

  async create(dto: CreateCompanyDto) {
    try {
      return await this.companiesRepo.create(dto);
    } catch (error: any) {
      if ('code' in error && error.code === 'P2002') {
        throw new ConflictException(
          `Já existe uma empresa com o CNPJ ${cnpj.format(dto.cnpj)}`,
        );
      }
      throw error;
    }
  }
  async findAll(
    page: number = 1,
    page_size: number = 10,
  ): Promise<PaginatedResponseDto<Company>> {
    return this.companiesRepo.findAll(page, page_size);
  }

  async findById(id: number) {
    const company = await this.companiesRepo.findById(id);
    if (!company) throw new NotFoundException('Empresa não encontrada');
    return company;
  }

  async update(id: number, dto: UpdateCompanyDto) {
    const company = await this.companiesRepo.findById(id);
    if (!company) throw new NotFoundException('Empresa não encontrada');

    try {
      return this.companiesRepo.update(id, dto);
    } catch (error: any) {
      if ('code' in error && error.code === 'P2002') {
        throw new ConflictException(
          `Já existe uma empresa com o CNPJ ${cnpj.format(dto.cnpj!)}`,
        );
      }
      throw error;
    }
  }

  async delete(id: number) {
    const company = await this.companiesRepo.findById(id);
    if (!company) throw new NotFoundException('Empresa não encontrada');
    return this.companiesRepo.delete(id);
  }
}
