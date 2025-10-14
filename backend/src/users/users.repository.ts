import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, Role, Prisma } from '@prisma/client';
import { paginate } from 'src/common/pagination/pagination.util';
import { PaginatedResponseDto } from 'src/common/pagination/pagination-response.dto';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async createUser(email: string, password: string, role: Role): Promise<User> {
    return this.prisma.user.create({
      data: { email, password, role },
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findAllExcept(
    currentUserId: number,
    page: number,
    page_size: number,
  ): Promise<PaginatedResponseDto<User>> {
    return paginate<User>(this.prisma.user, {
      where: { id: { not: currentUserId } },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      page,
      page_size,
    });
  }

  async updateUser(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id: number): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }
}
