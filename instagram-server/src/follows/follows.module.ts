import { Module } from '@nestjs/common';
import { FollowsService } from './follows.service';
import { FollowsController } from './follows.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RequestsService } from './requests.service';
import { BlocksService } from './blocks.service';

@Module({
  imports: [PrismaModule],
  controllers: [FollowsController],
  providers: [FollowsService, RequestsService, BlocksService],
})
export class FollowsModule {}
