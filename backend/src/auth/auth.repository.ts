import { Injectable } from '@nestjs/common';
import { UsersRepository } from 'src/users/users.repository';

@Injectable()
export class AuthRepository {
  constructor(private readonly usersRepo: UsersRepository) {}

  async findUserByEmail(email: string) {
    return this.usersRepo.findByEmail(email);
  }
}
