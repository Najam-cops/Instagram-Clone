import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadService } from 'src/upload/upload.service';

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
    take?: number;
    cursor?: string;
    orderBy?: Prisma.PostOrderByWithRelationInput;
  }) {
    const { take = 10, cursor, orderBy = { createdAt: 'desc' } } = params;

    const posts = await this.prisma.post.findMany({
      take,
      skip: cursor ? 1 : 0, // Skip the cursor if we have one
      cursor: cursor ? { id: cursor } : undefined,
      orderBy,
      include: {
        images: true,
        user: {
          select: {
            id: true,
            username: true,
            profileImage: true,
          },
        },
        _count: {
          select: {
            Likes: true,
          },
        },
      },
    });

    const lastPostInResults = posts[posts.length - 1];
    const nextCursor = lastPostInResults?.id;

    return {
      posts,
      nextCursor,
    };
  }

  async findOne(id: string) {
    return this.prisma.post.findUnique({
      where: { id },
    });
  }

  async update(id: string, updatePostDto: Prisma.PostUpdateInput) {
    return this.prisma.post.update({
      where: { id },
      data: updatePostDto,
    });
  }

  async remove(id: string) {
    return this.prisma.post.delete({
      where: { id },
    });
  }
}
