import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({});

async function main() {
  const user1 = await prisma.user.create({
    data: {
      email: 'ariadne@prisma.io',
      name: 'Ariadne',
      username: 'ariadne',
      password: 'password',
      posts: {
        create: [
          {
            title: 'My first day at Prisma',
            content: 'Content of the first post',
          },
          {
            title: 'How to connect to a SQLite database',
            content: 'Content of the second post',
          },
          {
            title: 'Understanding Prisma Client',
            content: 'Content of the third post',
          },
        ],
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'bob@prisma.io',
      name: 'Bob',
      username: 'bob',
      password: 'password',
      posts: {
        create: [
          {
            title: 'Introduction to Prisma',
            content: 'Content of the first post',
          },
          {
            title: 'Advanced Prisma Queries',
            content: 'Content of the second post',
          },
          {
            title: 'Prisma with PostgreSQL',
            content: 'Content of the third post',
          },
        ],
      },
    },
  });

  const returnUsers = await prisma.user.findMany({
    include: {
      posts: true,
    },
  });

  console.log(returnUsers);
}

main();
