import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { Role, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PaginatedResponseDto } from 'src/common/pagination/pagination-response.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}

  async createUser(
    requestingUserRole: Role,
    email: string,
    password: string,
    role: Role,
  ) {
    if (requestingUserRole !== Role.ADMIN) {
      throw new ForbiddenException(
        'Somente administradores podem criar usuários.',
      );
    }

    const existing = await this.usersRepo.findByEmail(email);
    if (existing) {
      throw new ForbiddenException('Já existe um usuário com este email.');
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await this.usersRepo.createUser(email, hashed, role);
    const { password: _, ...safe } = user;
    return safe;
  }

  async findAll(
    requestingUserRole: Role,
    currentUserId: number,
    page: number = 1,
    page_size: number = 10,
  ): Promise<PaginatedResponseDto<User>> {
    if (requestingUserRole !== Role.ADMIN) {
      throw new ForbiddenException(
        'Somente administradores podem listar todos os usuários.',
      );
    }
    return this.usersRepo.findAllExcept(currentUserId, page, page_size);
  }

  async findMe(currentUserId: number) {
    const user = await this.usersRepo.findById(currentUserId);
    if (!user) throw new NotFoundException('Usuário não encontrado');
    const { password, ...safe } = user;
    return safe;
  }

  async deleteUser(requestingUserRole: Role, targetUserId: number) {
    if (requestingUserRole !== Role.ADMIN) {
      throw new ForbiddenException(
        'Somente administradores podem deletar usuários.',
      );
    }

    const deleted = await this.usersRepo.deleteUser(targetUserId);
    const { password, ...safe } = deleted;
    return safe;
  }
}
