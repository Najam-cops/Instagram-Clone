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
    console.log(comment, postId, userId);
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
    const comment = await this.prisma.postComment.findUnique({
      where: { id },
      include: {
        post: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId !== userId && comment.post.userId !== userId) {
      throw new UnauthorizedException('You can only delete your own comments');
    }

    await this.prisma.postComment.delete({
      where: { id },
    });

    return { message: 'Comment deleted' };
  }

  async getPostComments(postId: string, userId: string) {
    const comments = await this.prisma.postComment.findMany({
      where: { postId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profileImage: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return comments.map((comment) => {
      return {
        ...comment,
        isLiked: comment?.likes?.some((like) => like.userId === userId),
      };
    });
  }

  async likeComment(commentId: string, userId: string) {
    const comment = await this.prisma.postComment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const existingLike = await this.prisma.commentLike.findFirst({
      where: {
        commentId,
        userId,
      },
    });

    if (existingLike) {
      throw new UnauthorizedException('You have already liked this comment');
    }

    return this.prisma.commentLike.create({
      data: {
        comment: {
          connect: { id: commentId },
        },
        user: {
          connect: { id: userId },
        },
      },
    });
  }

  async unlikeComment(commentId: string, userId: string) {
    const comment = await this.prisma.postComment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const like = await this.prisma.commentLike.findFirst({
      where: {
        commentId,
        userId,
      },
    });

    if (!like) {
      throw new NotFoundException('You have not liked this comment');
    }

    await this.prisma.commentLike.delete({
      where: { id: like.id },
    });

    return { message: 'Comment unliked successfully' };
  }
}
