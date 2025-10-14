import { Module } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersController } from './users.controller';

@Module({
  providers: [UsersRepository, UsersService, PrismaService],
  exports: [UsersService, UsersRepository],
  controllers: [UsersController],
})
export class UsersModule {}
