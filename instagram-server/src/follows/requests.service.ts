import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface RequestUser {
  id: string;
  email: string;
}

@Injectable()
export class RequestsService {
  constructor(private readonly prisma: PrismaService) {}

  async acceptRequest(requestId: string, req: { user: RequestUser }) {
    const request = await this.prisma.followRequests.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException('Follow request not found');
    }

    if (request.requestedId !== req.user.id) {
      throw new UnauthorizedException('Not authorized to accept this request');
    }

    await this.prisma.follows.create({
      data: {
        followerId: request.requesterId,
        followingId: request.requestedId,
      },
    });
    return this.prisma.followRequests.update({
      where: { id: requestId },
      data: { requestStatus: 'ACCEPTED' },
    });
  }

  async rejectRequest(requestId: string, req: { user: RequestUser }) {
    const request = await this.prisma.followRequests.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException('Follow request not found');
    }

    if (request.requestedId !== req.user.id) {
      throw new UnauthorizedException('Not authorized to reject this request');
    }

    return this.prisma.followRequests.update({
      where: { id: requestId },
      data: { requestStatus: 'REJECTED' },
    });
  }

  async deleteRequest(requestId: string, req: { user: RequestUser }) {
    const request = await this.prisma.followRequests.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException('Follow request not found');
    }

    if (
      request.requesterId !== req.user.id &&
      request.requestedId !== req.user.id
    ) {
      throw new UnauthorizedException('Not authorized to delete this request');
    }

    return this.prisma.followRequests.delete({
      where: { id: requestId },
    });
  }
}
