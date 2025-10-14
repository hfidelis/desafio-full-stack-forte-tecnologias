import dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const prisma = new PrismaClient();

async function seed() {
  const assetTypes = [
    'notebook',
    'monitor',
    'smartphone',
    'tablet',
    'desktop',
    'printer',
    'other',
  ];

  for (const typeName of assetTypes) {
    await prisma.assetType.upsert({
      where: { name: typeName },
      update: {},
      create: { name: typeName },
    });
  }

  const assetStatuses = ['available', 'allocated', 'maintenance'];
  for (const statusName of assetStatuses) {
    await prisma.assetStatus.upsert({
      where: { name: statusName },
      update: {},
      create: { name: statusName },
    });
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@forte.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'forteadmin';
  const hashed: string = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashed,
      role: 'ADMIN',
    },
  });

  console.log('[INFO] initial data has been seeded.');

  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
