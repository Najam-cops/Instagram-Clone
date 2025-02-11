import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthEntity } from './entity/auth.entity';
import { Prisma } from '@prisma/client';
import { HashingService } from './hashing/hashing.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private hashingService: HashingService,
  ) {}

  async login(email: string, password: string): Promise<AuthEntity> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await this.hashingService.comparePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Password or Email is not valid');
    }

    const userData = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        profileImage: true,
        username: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      ...userData,
      accessToken: this.jwtService.sign({ sub: user.id }),
    };
  }

  async signup(createUserDto: Prisma.UserCreateInput): Promise<AuthEntity> {
    //check if user already exists
    const userExists = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (userExists) {
      throw new UnauthorizedException('User already exists');
    }

    const hashedPassword = await this.hashingService.hashPassword(
      createUserDto.password,
    );
    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
        username: createUserDto.username,
        name: createUserDto.name,
      },
    });

    const userData = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        profileImage: true,
        username: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      ...userData,
      accessToken: this.jwtService.sign({ sub: user.id }),
    };
  }

  async logout(req: any) {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader.split(' ')[1];
      // console.log('token', token);
      // console.log('authHeader', authHeader);
      if (token) {
        const invalid = await this.prisma.tokenBlacklist.create({
          data: {
            token,
          },
        });
        console.log('invalid', invalid);

        return { message: 'Logged out' };
      }
    } catch (error) {
      console.error('Error during logout:', error);
      throw new UnauthorizedException('Logout failed');
    }
  }
}
