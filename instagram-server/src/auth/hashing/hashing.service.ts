import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashingService {
  abstract hashPassword(password: string | Buffer): Promise<string>;
  abstract comparePassword(
    password: string | Buffer,
    hash: string,
  ): Promise<boolean>;
}
