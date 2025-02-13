import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {}

  private s3 = new S3Client({
    region: this.configService.get<string>('AWS_REGION'),
    credentials: {
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID')!,
      secretAccessKey: this.configService.get<string>('AWS_ACCESS_KEY_SECRET')!,
    },
  });

  async uploadFile(fileName: string, file: Buffer): Promise<string> {
    const bucket = this.configService.get<string>('AWS_BUCKET_NAME');

    await this.s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: fileName,
        Body: file,
      }),
    );

    const url = `https://${bucket}.s3.${this.configService.get<string>('AWS_REGION')}.amazonaws.com/${fileName}`;
    return url;
  }
}
