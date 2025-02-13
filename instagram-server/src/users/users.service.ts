import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  create(createUserDto: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  update(id: string, updateUserDto: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async isFollower(followerId: string, followingId: string) {
    const follow = await this.prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followingId,
          followerId,
        },
      },
    });
    return !!follow;
  }

  async isFollowing(followerId: string, followingId: string) {
    const follow = await this.prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });
    return !!follow;
  }

  async isBlocked(blockerId: string, blockedById: string) {
    const block = await this.prisma.blocks.findUnique({
      where: {
        blockerId_blockedById: {
          blockerId,
          blockedById,
        },
      },
    });
    return !!block;
  }

  async getFollowRequests(userId: string, requesterId: string) {
    const user = await this.findOne(userId);
    const isFollowing = await this.isFollowing(requesterId, userId);

    if (user?.isPrivate && !isFollowing && userId !== requesterId) {
      return [];
    }

    return this.prisma.followRequests.findMany({
      where: {
        requestedId: userId,
        requestStatus: 'PENDING',
      },
      include: {
        requester: {
          select: {
            id: true,
            username: true,
            name: true,
            profileImage: true,
          },
        },
      },
    });
  }

  async getFollowers(userId: string, requesterId: string) {
    const user = await this.findOne(userId);
    const isFollowing = await this.isFollowing(requesterId, userId);

    if (user?.isPrivate && !isFollowing && userId !== requesterId) {
      return [];
    }

    return this.prisma.follows.findMany({
      where: {
        followingId: userId,
      },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            name: true,
            profileImage: true,
          },
        },
      },
    });
  }

  async getFollowing(userId: string, requesterId: string) {
    const user = await this.findOne(userId);
    const isFollowing = await this.isFollowing(requesterId, userId);

    if (user?.isPrivate && !isFollowing && userId !== requesterId) {
      return [];
    }

    return this.prisma.follows.findMany({
      where: {
        followerId: userId,
      },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            name: true,
            profileImage: true,
          },
        },
      },
    });
  }

  async getBlocked(userId: string, requesterId: string) {
    const user = await this.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (userId !== requesterId) {
      return [];
    }

    return this.prisma.blocks.findMany({
      where: {
        blockerId: userId,
      },
      include: {
        blockedBy: {
          select: {
            id: true,
            username: true,
            name: true,
            profileImage: true,
          },
        },
      },
    });
  }

  async getPosts(userId: string) {
    return this.prisma.post.findMany({
      where: {
        userId,
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
        _count: {
          select: {
            Likes: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
