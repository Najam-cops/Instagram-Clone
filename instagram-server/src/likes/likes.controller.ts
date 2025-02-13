import {
  Controller,
  Post,
  Delete,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtBlacklistGuard } from 'src/guards/BlackListToken';

interface RequestWithUser extends Request {
  user: {
    id: string;
  };
}

@Controller('likes')
@UseGuards(JwtBlacklistGuard)
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post(':postId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  addLike(@Param('postId') postId: string, @Req() req: RequestWithUser) {
    return this.likesService.addLike(postId, req.user.id);
  }

  @Delete(':postId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  removeLike(@Param('postId') postId: string, @Req() req: RequestWithUser) {
    return this.likesService.removeLike(postId, req.user.id);
  }
}
