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

  async findAll(limit?: number, search?: string, requesterId?: string) {
    search = search?.trim();

    const following = await this.prisma.follows.findMany({
      where: {
        followerId: requesterId,
      },
      select: {
        followingId: true,
      },
    });

    const followingIds = following.map((f) => f.followingId);

    // Get all pending follow requests made by the requester
    const pendingRequests = await this.prisma.followRequests.findMany({
      where: {
        requesterId,
        requestStatus: 'PENDING',
      },
      select: {
        requestedId: true,
      },
    });

    const pendingRequestIds = pendingRequests.map((r) => r.requestedId);

    const users = await this.prisma.user.findMany({
      where: {
        username: {
          contains: search,
          mode: 'insensitive',
        },
        id: {
          not: requesterId,
          notIn: followingIds,
        },
      },
      take: limit,
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        profileImage: true,
        isPrivate: true,
        createdAt: true,
      },
    });

    // Add requestSent field to each user
    return users.map((user) => ({
      ...user,
      requestSent: pendingRequestIds.includes(user.id),
    }));
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  update(id: string, updateUserDto: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where: {
        id: id,
      },
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

  async togglePrivacy(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    console.log('user', user);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updateData = {
      isPrivate: !user.isPrivate,
    } as Prisma.UserUpdateInput;

    return this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
  }
}
