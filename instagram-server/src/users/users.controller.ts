import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/upload/upload.service';

interface RequestWithUser extends Request {
  user: {
    id: string;
  };
}

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  create(@Body() createUserDto: Prisma.UserCreateInput) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id/requests')
  @UseGuards(JwtAuthGuard)
  getFollowRequests(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.usersService.getFollowRequests(id, req.user.id);
  }

  @Get(':id/followers')
  @UseGuards(JwtAuthGuard)
  getFollowers(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.usersService.getFollowers(id, req.user.id);
  }

  @Get(':id/following')
  @UseGuards(JwtAuthGuard)
  getFollowing(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.usersService.getFollowing(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: RequestWithUser) {
    const user = await this.usersService.findOne(id);

    if (req.user.id !== id) {
      const isFollowing = await this.usersService.isFollowing(req.user.id, id);
      const isFollower = await this.usersService.isFollower(req.user.id, id);
      const isBlocked = await this.usersService.isBlocked(req.user.id, id);

      return {
        ...user,
        isFollowing,
        isFollower,
        isBlocked,
        isPrivateAndNotFollowing: user?.isPrivate && !isFollowing,
      };
    }

    return user;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getCurrentUser(@Req() req: RequestWithUser) {
    return this.usersService.findOne(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/profile-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfileImage(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Req() req: RequestWithUser,
  ) {
    if (req.user.id !== id) {
      throw new UnauthorizedException(
        'You can only update your own profile image',
      );
    }

    const imageUrl = await this.uploadService.uploadFile(
      `profile-${id}-${Date.now()}-${file.originalname}`,
      file.buffer,
    );

    const profile = await this.usersService.update(id, {
      profileImage: imageUrl,
    });
    console.log(profile);
    return { message: 'Profile image uploaded successfully', sucess: true };
  }
}
