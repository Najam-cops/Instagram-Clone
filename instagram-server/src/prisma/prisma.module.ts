import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService], //  export PrismaService to be used somewhere else
})
export class PrismaModule {}
