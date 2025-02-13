import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(comment: string, postId: string, userId: string) {
    return this.prisma.postComment.create({
      data: {
        comment,
        post: {
          connect: { id: postId },
        },
        user: {
          connect: { id: userId },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profileImage: true,
          },
        },
      },
    });
  }

  async update(id: string, comment: string, userId: string) {
    // First check if comment exists and belongs to user
    const existingComment = await this.prisma.postComment.findUnique({
      where: { id },
    });

    if (!existingComment) {
      throw new NotFoundException('Comment not found');
    }

    if (existingComment.userId !== userId) {
      throw new UnauthorizedException('You can only update your own comments');
    }

    return this.prisma.postComment.update({
      where: { id },
      data: { comment },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profileImage: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    // First check if comment exists and belongs to user
    const comment = await this.prisma.postComment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId !== userId) {
      throw new UnauthorizedException('You can only delete your own comments');
    }

    const deleted = this.prisma.postComment.delete({
      where: { id },
    });
    return { message: 'Comment deleted' };
  }

  async getPostComments(postId: string) {
    return this.prisma.postComment.findMany({
      where: { postId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profileImage: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
