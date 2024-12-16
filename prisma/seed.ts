import { Prisma, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
async function main() {
  const adminEmail = 'superadmin@test.com';
  const adminPassword = 'superadmin123';
  const hashedPwd = await bcrypt.hash(adminPassword, 12);

  const existingAdmin = await prisma.users.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    await prisma.users.create({
      data: {
        email: adminEmail,
        password: hashedPwd,
        role: 'admin',
      },
    });
    console.log('Super admin user seeded successfully!');
  } else {
    console.log('Super admin user already exists. Skipping seed.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
