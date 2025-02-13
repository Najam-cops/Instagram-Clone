import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtBlacklistGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token =
      (request.cookies as { jwt?: string })?.jwt ||
      (request.headers.authorization as string)?.split(' ')[1];

    if (!token) return false;

    const isBlacklisted = await this.prismaService.tokenBlacklist.findFirst({
      where: { token },
    });
    console.log('isBlacklisted', isBlacklisted);
    return !isBlacklisted;
  }
}
