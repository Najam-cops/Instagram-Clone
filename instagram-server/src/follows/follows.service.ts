import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface RequestUser {
  id: string;
  email: string;
}

@Injectable()
export class FollowsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, req: { user: RequestUser }) {
    const followerId = req.user.id;

    if (followerId === userId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const targetUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      throw new BadRequestException('User not found');
    }

    // Check if user is blocked
    const isBlocked = await this.prisma.blocks.findFirst({
      where: {
        OR: [
          { blockerId: userId, blockedById: followerId },
          { blockerId: followerId, blockedById: userId },
        ],
      },
    });

    if (isBlocked) {
      throw new BadRequestException('Unable to follow this user');
    }

    const existingFollow = await this.prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: followerId,
          followingId: userId,
        },
      },
    });

    if (existingFollow) {
      throw new ConflictException('Already following this user');
    }

    const existingRequest = await this.prisma.followRequests.findUnique({
      where: {
        requesterId_requestedId: {
          requesterId: followerId,
          requestedId: userId,
        },
        requestStatus: 'PENDING',
      },
    });

    if (existingRequest) {
      throw new ConflictException('Follow request already sent');
    }

    if (targetUser.isPrivate) {
      return this.prisma.followRequests.create({
        data: {
          requesterId: followerId,
          requestedId: userId,
          requestStatus: 'PENDING',
        },
      });
    }

    return this.prisma.follows.create({
      data: {
        followerId: followerId,
        followingId: userId,
      },
    });
  }

  async unfollow(userId: string, req: { user: RequestUser }) {
    const followerId = req.user.id;

    if (followerId === userId) {
      throw new BadRequestException('You cannot unfollow yourself');
    }

    const follow = await this.prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: followerId,
          followingId: userId,
        },
      },
    });

    if (!follow) {
      throw new BadRequestException('You are not following this user');
    }

    return this.prisma.follows.delete({
      where: {
        followerId_followingId: {
          followerId: followerId,
          followingId: userId,
        },
      },
    });
  }

  async unfollowBoth(userId1: string, userId2: string) {
    // Remove follows in both directions if they exist
    await this.prisma.follows.deleteMany({
      where: {
        OR: [
          {
            followerId: userId1,
            followingId: userId2,
          },
          {
            followerId: userId2,
            followingId: userId1,
          },
        ],
      },
    });
  }
}
