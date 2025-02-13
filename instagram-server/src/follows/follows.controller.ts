import {
  Controller,
  Post,
  Delete,
  UseGuards,
  Req,
  Query,
  Param,
} from '@nestjs/common';
import { FollowsService } from './follows.service';
import { RequestsService } from './requests.service';
import { BlocksService } from './blocks.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

interface RequestUser {
  id: string;
  email: string;
}

@Controller('follows')
export class FollowsController {
  constructor(
    private readonly followsService: FollowsService,
    private readonly requestsService: RequestsService,
    private readonly blocksService: BlocksService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createWithQueryParam(
    @Query('userId') userId: string,
    @Req() req: { user: RequestUser },
  ) {
    return this.followsService.create(userId, req);
  }

  @UseGuards(JwtAuthGuard)
  @Post('accept/:requestId')
  acceptRequest(
    @Param('requestId') requestId: string,
    @Req() req: { user: RequestUser },
  ) {
    return this.requestsService.acceptRequest(requestId, req);
  }

  @UseGuards(JwtAuthGuard)
  @Post('reject/:requestId')
  rejectRequest(
    @Param('requestId') requestId: string,
    @Req() req: { user: RequestUser },
  ) {
    return this.requestsService.rejectRequest(requestId, req);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:requestId')
  deleteRequest(
    @Param('requestId') requestId: string,
    @Req() req: { user: RequestUser },
  ) {
    return this.requestsService.deleteRequest(requestId, req);
  }

  @UseGuards(JwtAuthGuard)
  @Post('block')
  async blockUser(
    @Query('userId') userId: string,
    @Req() req: { user: RequestUser },
  ) {
    // First block the user
    await this.blocksService.blockUser(userId, req);

    // Then unfollow each other if they are following
    await this.followsService.unfollowBoth(userId, req.user.id);

    return { message: 'User blocked and unfollowed' };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('unblock')
  unblockUser(
    @Query('userId') userId: string,
    @Req() req: { user: RequestUser },
  ) {
    return this.blocksService.unblockUser(userId, req);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  unfollow(@Param('id') id: string, @Req() req: { user: RequestUser }) {
    return this.followsService.unfollow(id, req);
  }
}
