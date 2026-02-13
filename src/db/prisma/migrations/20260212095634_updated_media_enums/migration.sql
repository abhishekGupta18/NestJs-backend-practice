/*
  Warnings:

  - Changed the type of `document_type` on the `document_attributes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `image_type` on the `image_attributes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `entity_type` on the `media_files` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "MediaFileEntityType" AS ENUM ('USER', 'PRODUCT', 'ORDER');

-- CreateEnum
CREATE TYPE "AccessLevel" AS ENUM ('PRIVATE', 'PUBLIC');

-- CreateEnum
CREATE TYPE "ImageType" AS ENUM ('MAIN', 'VARIANT');

-- AlterTable
ALTER TABLE "document_attributes" DROP COLUMN "document_type",
ADD COLUMN     "document_type" "MediaFileType" NOT NULL;

-- AlterTable
ALTER TABLE "image_attributes" DROP COLUMN "image_type",
ADD COLUMN     "image_type" "MediaFileType" NOT NULL;

-- AlterTable
ALTER TABLE "media_files" DROP COLUMN "entity_type",
ADD COLUMN     "entity_type" "MediaFileEntityType" NOT NULL;
