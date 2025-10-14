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
  @ApiOperation({ summary: 'Create a new asset' })
  @ApiResponse({
    status: 201,
    description: 'The asset has been successfully created.',
    type: CreateAssetDto,
  })
  create(@Body() dto: CreateAssetDto) {
    return this.assetsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all assets' })
  findAll() {
    return this.assetsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get asset by ID' })
  @ApiResponse({
    status: 200,
    description: 'The asset has been successfully retrieved.',
    type: CreateAssetDto,
  })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.assetsService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an asset' })
  @ApiResponse({
    status: 200,
    description: 'The asset has been successfully updated.',
    type: UpdateAssetDto,
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAssetDto) {
    return this.assetsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an asset' })
  @ApiResponse({
    status: 200,
    description: 'The asset has been successfully deleted.',
    type: CreateAssetDto,
  })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.assetsService.delete(id);
  }

  @Patch(':id/assign/:employeeId')
  @ApiOperation({ summary: 'Assign asset to employee' })
  assign(
    @Param('id', ParseIntPipe) id: number,
    @Param('employeeId', ParseIntPipe) employeeId: number,
  ) {
    return this.assetsService.assignToEmployee(id, employeeId);
  }

  @Patch(':id/unassign')
  @ApiOperation({ summary: 'Unassign asset from employee' })
  unassign(@Param('id', ParseIntPipe) id: number) {
    return this.assetsService.unassign(id);
  }

  @Get('employee/:employeeId')
  @ApiOperation({ summary: 'List all assets of an employee' })
  @ApiResponse({
    status: 200,
    description: 'The assets have been successfully retrieved.',
    type: [CreateAssetDto],
  })
  findByEmployee(@Param('employeeId', ParseIntPipe) employeeId: number) {
    return this.assetsService.findByEmployee(employeeId);
  }
}
