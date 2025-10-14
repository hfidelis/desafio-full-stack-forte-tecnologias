import {
  Controller,
  Get,
  Query,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { PaginatedResponseDto } from 'src/common/pagination/pagination-response.dto';

@ApiTags('Employees')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo funcionário' })
  @ApiResponse({ status: 201, description: 'Funcionário criado com sucesso' })
  create(@Body() dto: CreateEmployeeDto) {
    return this.employeesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os funcionários' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'page_size', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Funcionários listados com sucesso',
    type: PaginatedResponseDto,
  })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('page_size', new DefaultValuePipe(10), ParseIntPipe) page_size = 10,
  ) {
    return this.employeesService.findAll(page, page_size);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get employee by ID' })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.findById(id);
  }

  @Get('company/:companyId')
  @ApiOperation({ summary: 'Listar todos os funcionários de uma empresa' })
  findByCompany(@Param('companyId', ParseIntPipe) companyId: number) {
    return this.employeesService.findByCompany(companyId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um funcionário' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEmployeeDto,
  ) {
    return this.employeesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um funcionário' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.delete(id);
  }
}
