import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { ConfigModule } from '@nestjs/config';
import { FollowsModule } from './follows/follows.module';

@Module({
  imports: [
    PrismaModule,
    PostsModule,
    UsersModule,
    AuthModule,
    UploadModule,
    ConfigModule.forRoot({ isGlobal: true }),
    FollowsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
