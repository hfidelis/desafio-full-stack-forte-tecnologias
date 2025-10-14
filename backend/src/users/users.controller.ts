import {
  Controller,
  Get,
  Query,
  Delete,
  Param,
  UseGuards,
  Req,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/role.decorator';
import { Role, User } from '@prisma/client';
import { UserResponseDto } from './dto/user-response.dto';
import { PaginatedResponseDto } from 'src/common/pagination/pagination-response.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Listar todos os usuários (apenas ADMIN)' })
  @ApiResponse({
    status: 200,
    description: 'Usuários listados com sucesso',
    type: PaginatedResponseDto<UserResponseDto>,
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'page_size', required: false, type: Number, example: 10 })
  async findAll(
    @Req() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('page_size', new DefaultValuePipe(10), ParseIntPipe) page_size = 10,
  ) {
    return this.usersService.findAll(
      req.user.role,
      req.user.userId,
      page,
      page_size,
    );
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
