import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

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
      throw new ForbiddenException('Only administrators can create new users.');
    }

    const existing = await this.usersRepo.findByEmail(email);
    if (existing) {
      throw new ForbiddenException('A user with this email already exists.');
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await this.usersRepo.createUser(email, hashed, role);
    const { password: _, ...safe } = user;
    return safe;
  }

  async findAll(requestingUserRole: Role, currentUserId: number) {
    if (requestingUserRole !== Role.ADMIN) {
      throw new ForbiddenException('Only administrators can list all users.');
    }
    return this.usersRepo.findAllExcept(currentUserId);
  }

  async findMe(currentUserId: number) {
    const user = await this.usersRepo.findById(currentUserId);
    if (!user) throw new NotFoundException('User not found');
    const { password, ...safe } = user;
    return safe;
  }

  async deleteUser(requestingUserRole: Role, targetUserId: number) {
    if (requestingUserRole !== Role.ADMIN) {
      throw new ForbiddenException('Only administrators can delete users.');
    }

    const deleted = await this.usersRepo.deleteUser(targetUserId);
    const { password, ...safe } = deleted;
    return safe;
  }
}
