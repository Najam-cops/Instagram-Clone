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
  @Delete('request/:requestId')
  deleteRequest(
    @Param('requestId') requestId: string,
    @Req() req: { user: RequestUser },
  ) {
    return this.requestsService.deleteRequest(requestId, req);
  }
}
