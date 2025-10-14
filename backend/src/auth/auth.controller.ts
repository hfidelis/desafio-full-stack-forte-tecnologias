import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { JwtAuthGuard } from './jwt.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './role.decorator';
import { Role, User } from '@prisma/client';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Login do usuário realizado com sucesso',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('register')
  @ApiOperation({ summary: 'Registrar um novo usuário (apenas ADMIN)' })
  @ApiResponse({
    status: 201,
    description: 'Usuário registrado com sucesso',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  async register(@Req() req, @Body() dto: CreateUserDto) {
    const request: Request = req;
    const requestUser: User = request['user'];
    const requestingUserRole = requestUser.role;

    const user = await this.authService.createUser(
      requestingUserRole,
      dto.email,
      dto.password,
      dto.role,
    );

    return new UserResponseDto(user);
  }
}
