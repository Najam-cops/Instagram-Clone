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
  UseInterceptors,
  UploadedFiles,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/upload/upload.service';
import { Request } from 'express';
import { JwtBlacklistGuard } from 'src/guards/BlackListToken';

interface RequestWithUser extends Request {
  user: User;
}

@Controller('posts')
@UseGuards(JwtBlacklistGuard)
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly uploadService: UploadService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('files', 3))
  async create(
    @Body() createPostDto: { description: string },
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
      }),
    )
    files: Express.Multer.File[],
    @Req() req: RequestWithUser,
  ) {
    return this.postsService.create(createPostDto, files, req.user.id);
  }
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiQuery({ name: 'cursor', required: false })
  @ApiQuery({ name: 'take', required: false })
  findAll(
    @Req() req: RequestWithUser,
    @Query('cursor') cursor?: string,
    @Query('take') take?: string,
  ) {
    return this.postsService.findAll({
      userId: req.user.id,
      cursor,
      take: take ? parseInt(take, 10) : undefined,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() data: { description: string },
    @Req() req: RequestWithUser,
  ) {
    return this.postsService.update(id, data.description, req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.postsService.remove(id, req.user.id);
  }
}
