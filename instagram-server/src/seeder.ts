import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({});

// A `main` function so that you can use async/await
async function main() {
  // Create first user with three posts
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

  // Create second user with three posts
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

  // Return users and their posts
  const returnUsers = await prisma.user.findMany({
    include: {
      posts: true,
    },
  });

  console.log(returnUsers);
}

main();
