import {
  Controller,
  Get,
  Delete,
  Param,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/role.decorator';
import { Role, User } from '@prisma/client';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Listar todos os usuários (apenas ADMIN)' })
  @ApiResponse({ status: 200, description: 'Usuários listados com sucesso' })
  async findAll(@Req() req) {
    return this.usersService.findAll(req.user.role, req.user.userId);
  }

  @Get('me')
  @ApiOperation({ summary: 'Listar informações do usuário autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Informações retornadas com sucesso',
  })
  async findMe(@Req() req) {
    return this.usersService.findMe(req.user.userId);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Remover usuário (apenas ADMIN)' })
  async deleteUser(@Req() req, @Param('id', ParseIntPipe) id: number) {
    const request: Request = req;
    const user: User = request['user'];
    return this.usersService.deleteUser(user.role, id);
  }
}
