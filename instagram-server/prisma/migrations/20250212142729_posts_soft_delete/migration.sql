-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('DELETED', 'ACTIVE');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "status" "PostStatus" NOT NULL DEFAULT 'ACTIVE';
