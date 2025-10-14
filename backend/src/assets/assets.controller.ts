import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Assets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo ativo' })
  @ApiResponse({
    status: 201,
    description: 'O ativo foi criado com sucesso.',
    type: CreateAssetDto,
  })
  create(@Body() dto: CreateAssetDto) {
    return this.assetsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os ativos' })
  findAll() {
    return this.assetsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter ativo por ID' })
  @ApiResponse({
    status: 200,
    description: 'O ativo foi recuperado com sucesso.',
    type: CreateAssetDto,
  })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.assetsService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um ativo' })
  @ApiResponse({
    status: 200,
    description: 'O ativo foi atualizado com sucesso.',
    type: UpdateAssetDto,
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAssetDto) {
    return this.assetsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar um ativo' })
  @ApiResponse({
    status: 200,
    description: 'O ativo foi deletado com sucesso.',
    type: CreateAssetDto,
  })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.assetsService.delete(id);
  }

  @Patch(':id/assign/:employeeId')
  @ApiOperation({ summary: 'Associar ativo a um funcionário' })
  assign(
    @Param('id', ParseIntPipe) id: number,
    @Param('employeeId', ParseIntPipe) employeeId: number,
  ) {
    return this.assetsService.assignToEmployee(id, employeeId);
  }

  @Patch(':id/unassign')
  @ApiOperation({ summary: 'Desassociar ativo de um funcionário' })
  unassign(@Param('id', ParseIntPipe) id: number) {
    return this.assetsService.unassign(id);
  }

  @Get('employee/:employeeId')
  @ApiOperation({ summary: 'Listar todos os ativos de um funcionário' })
  @ApiResponse({
    status: 200,
    description: 'Os ativos foram recuperados com sucesso.',
    type: [CreateAssetDto],
  })
  findByEmployee(@Param('employeeId', ParseIntPipe) employeeId: number) {
    return this.assetsService.findByEmployee(employeeId);
  }
}
