import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface RequestUser {
  id: string;
  email: string;
}

@Injectable()
export class BlocksService {
  constructor(private readonly prisma: PrismaService) {}

  async blockUser(userIdToBlock: string, req: { user: RequestUser }) {
    // Check if user exists
    const userToBlock = await this.prisma.user.findUnique({
      where: { id: userIdToBlock },
    });

    if (!userToBlock) {
      throw new NotFoundException('User to block not found');
    }

    // Check if already blocked
    const existingBlock = await this.prisma.blocks.findFirst({
      where: {
        blockerId: req.user.id,
        blockedById: userIdToBlock,
      },
    });

    if (existingBlock) {
      throw new ConflictException('User is already blocked');
    }

    // Create block record
    return this.prisma.blocks.create({
      data: {
        blockerId: req.user.id,
        blockedById: userIdToBlock,
      },
    });
  }

  async unblockUser(userIdToUnblock: string, req: { user: RequestUser }) {
    // Find the block record
    const block = await this.prisma.blocks.findFirst({
      where: {
        blockerId: req.user.id,
        blockedById: userIdToUnblock,
      },
    });

    if (!block) {
      throw new NotFoundException('Block record not found');
    }

    // Delete the block record
    return this.prisma.blocks.delete({
      where: {
        id: block.id,
      },
    });
  }
}
