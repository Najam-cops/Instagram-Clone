import { Module } from '@nestjs/common';
import { FollowsService } from './follows.service';
import { FollowsController } from './follows.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RequestsService } from './requests.service';

@Module({
  imports: [PrismaModule],
  controllers: [FollowsController],
  providers: [FollowsService, RequestsService],
})
export class FollowsModule {}
