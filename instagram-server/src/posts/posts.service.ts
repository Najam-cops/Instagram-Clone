import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Post, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadService } from 'src/upload/upload.service';

interface PostWithUser extends Post {
  user: Pick<User, 'id' | 'username' | 'profileImage'>;
  images: { url: string }[];
  _count: { Likes: number; comments: number };
  Likes: { id: string }[];
}

@Injectable()
export class PostsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  async create(
    createPostDto: { description: string },
    files: Express.Multer.File[],
    userId: string,
  ) {
    // Upload images to S3 and get URLs
    const imageUrls = await Promise.all(
      files.map((file) =>
        this.uploadService.uploadFile(
          `${Date.now()}-${file.originalname}`,
          file.buffer,
        ),
      ),
    );

    // Create post with images
    return this.prisma.post.create({
      data: {
        description: createPostDto.description,
        user: {
          connect: { id: userId },
        },
        images: {
          create: imageUrls.map((url) => ({
            url,
          })),
        },
      },
      include: {
        images: true,
      },
    });
  }

  async findAll(params: {
    userId: string;
    take?: number;
    cursor?: string;
    orderBy?: Prisma.PostOrderByWithRelationInput;
  }) {
    const {
      userId,
      take = 10,
      cursor,
      orderBy = { createdAt: 'desc' },
    } = params;

    const posts = (await this.prisma.post.findMany({
      take,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy,
      where: {
        user: {
          AND: [
            {
              blcokedByUsers: {
                none: {
                  blockerId: userId,
                },
              },
            },
            {
              blockedUsers: {
                none: {
                  blockedById: userId,
                },
              },
            },
            {
              OR: [
                { isPrivate: false },
                {
                  followers: {
                    some: {
                      followerId: userId,
                    },
                  },
                },
                { id: userId },
              ],
            },
          ],
        },
        status: 'ACTIVE',
      },
      include: {
        images: true,
        user: {
          select: {
            id: true,
            username: true,
            profileImage: true,
          },
        },
        Likes: {
          where: {
            userId: userId,
          },
          select: {
            id: true,
          },
        },
        _count: {
          select: {
            Likes: true,
            comments: true,
          },
        },
      },
    })) as PostWithUser[];

    let nextCursor: string | undefined;
    if (posts.length > 0) {
      const lastPostInResults = posts[posts.length - 1];
      nextCursor = lastPostInResults.id;
    }

    const postsWithOwnership = posts.map((post) => ({
      ...post,
      owned: post.user.id === userId,
      isLiked: post.Likes.length > 0,
      Likes: undefined,
    }));

    return {
      posts: postsWithOwnership,
      nextCursor,
    };
  }

  async findOne(id: string) {
    return this.prisma.post.findUnique({
      where: { id },
    });
  }

  async update(id: string, description: string, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      select: {
        userId: true,
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    console.log('description', description);

    if (post.userId !== userId) {
      throw new NotAcceptableException('You cannot update this post');
    }

    return this.prisma.post.update({
      where: { id },
      data: {
        description: description,
      },
    });
  }

  async remove(postId: string, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: {
        userId: true,
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.userId !== userId) {
      throw new NotAcceptableException('You cannot delete this post found');
    }

    return this.prisma.post.update({
      where: { id: postId },
      data: { status: 'DELETED' },
    });
  }

  async findUserPosts(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const posts = await this.prisma.post.findMany({
      where: {
        userId,
      },
    });
    return posts;
  }
}
