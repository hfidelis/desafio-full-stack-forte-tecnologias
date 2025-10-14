import { Module } from '@nestjs/common';
import { EmployeesRepository } from './employees.repository';
import { EmployeesService } from './employees.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmployeesController } from './employees.controller';

@Module({
  providers: [EmployeesRepository, EmployeesService, PrismaService],
  exports: [EmployeesService, EmployeesRepository],
  controllers: [EmployeesController],
})
export class EmployeesModule {}
