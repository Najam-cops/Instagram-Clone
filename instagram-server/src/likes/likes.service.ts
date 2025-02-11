import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LikesService {
  constructor(private readonly prisma: PrismaService) {}

  async addLike(postId: string, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existingLike = await this.prisma.postLike.findFirst({
      where: {
        AND: [{ postId: postId }, { userId: userId }],
      },
    });

    if (!existingLike) {
      await this.prisma.postLike.create({
        data: {
          post: { connect: { id: postId } },
          user: { connect: { id: userId } },
        },
      });
    }

    return { message: 'Post liked successfully' };
  }

  async removeLike(postId: string, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    await this.prisma.postLike.deleteMany({
      where: {
        AND: [{ postId: postId }, { userId: userId }],
      },
    });

    return { message: 'Like removed successfully' };
  }
}
