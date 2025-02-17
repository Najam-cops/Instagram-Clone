import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtBlacklistGuard } from 'src/guards/BlackListToken';

interface RequestWithUser extends Request {
  user: {
    id: string;
  };
}

@Controller('comments')
@UseGuards(JwtBlacklistGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':postId')
  create(
    @Param('postId') postId: string,
    @Body('comment') comment: string,
    @Req() req: RequestWithUser,
  ) {
    return this.commentsService.create(comment, postId, req.user.id);
  }
  @UseGuards(JwtAuthGuard)
  @Get('post/:postId/comment')
  getPostComment(@Param('postId') postId: string, @Req() req: RequestWithUser) {
    return this.commentsService.getSingleComment(postId, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('post/:postId')
  getPostComments(
    @Param('postId') postId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.commentsService.getPostComments(postId, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':commentId/like')
  likeComment(
    @Param('commentId') commentId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.commentsService.likeComment(commentId, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':commentId/unlike')
  unlikeComment(
    @Param('commentId') commentId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.commentsService.unlikeComment(commentId, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body('comment') comment: string,
    @Req() req: RequestWithUser,
  ) {
    return this.commentsService.update(id, comment, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.commentsService.remove(id, req.user.id);
  }
}
