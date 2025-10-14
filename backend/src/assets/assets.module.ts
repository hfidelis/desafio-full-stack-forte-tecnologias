import { Module } from '@nestjs/common';
import { AssetsRepository } from './assets.repository';
import { AssetsService } from './assets.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AssetsController } from './assets.controller';

@Module({
  providers: [AssetsRepository, AssetsService, PrismaService],
  exports: [AssetsService, AssetsRepository],
  controllers: [AssetsController],
})
export class AssetsModule {}
