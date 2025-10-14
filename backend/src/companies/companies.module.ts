import { Module } from '@nestjs/common';
import { CompaniesRepository } from './companies.repository';
import { CompaniesService } from './companies.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CompaniesController } from './companies.controller';

@Module({
  providers: [CompaniesRepository, CompaniesService, PrismaService],
  exports: [CompaniesService, CompaniesRepository],
  controllers: [CompaniesController],
})
export class CompaniesModule {}
