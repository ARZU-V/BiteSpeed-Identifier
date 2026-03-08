// prisma/seed.ts
import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('--- Identity Reconciliation Seed Starting ---');

  // 1. Clean existing data to ensure a fresh start
  console.log('Cleaning up existing contacts...');
  await prisma.contact.deleteMany();

  // 2. Seed Example 1: The "Lorraine" Case
  console.log('Seeding Lorraine (ID: 1)...');
  await prisma.contact.create({
    data: {
      id: 1,
      email: 'lorraine@hillvalley.edu',
      phoneNumber: '123456',
      linkPrecedence: 'primary',
    },
  });

  // 3. Seed Example 2: The "George & Biff" Bridge Case
  // This sets up two separate primaries that can be merged by a single request.
  console.log('Seeding George (ID: 11) and Biff (ID: 27)...');
  await prisma.contact.createMany({
    data: [
      {
        id: 11,
        email: 'george@hillvalley.edu',
        phoneNumber: '919191',
        linkPrecedence: 'primary',
      },
      {
        id: 27,
        email: 'biffsucks@hillvalley.edu',
        phoneNumber: '717171',
        linkPrecedence: 'primary',
      },
    ],
  });

  console.log('--- Seed Completed Successfully! ---');
}

main()
  .catch((e) => {
    console.error('Seed Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    // Standard cleanup for the adapter-pg connection
    await prisma.$disconnect();
  });