/*
  Warnings:

  - You are about to drop the column `product_image` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `profile_url` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "MediaFileType" AS ENUM ('PROFILE_IMAGE', 'COVER_IMAGE', 'PRODUCT_IMAGE_MAIN', 'PRODUCT_IMAGE_VARIANT', 'INVOICE', 'RECEIPT');

-- AlterTable
ALTER TABLE "products" DROP COLUMN "product_image";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "profile_url";

-- CreateTable
CREATE TABLE "media_files" (
    "id" TEXT NOT NULL,
    "entity_type" "MediaFileType" NOT NULL,
    "entity_id" VARCHAR(50) NOT NULL,
    "s3_key" VARCHAR(255) NOT NULL,
    "access_level" VARCHAR(50) NOT NULL DEFAULT 'PRIVATE',
    "status" VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "image_attributes" (
    "id" TEXT NOT NULL,
    "media_file_id" TEXT NOT NULL,
    "image_type" VARCHAR(50) NOT NULL,
    "alt_text" VARCHAR(255),
    "display_order" INTEGER DEFAULT 0,
    "width_px" INTEGER,
    "height_px" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "image_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_attributes" (
    "id" TEXT NOT NULL,
    "media_file_id" TEXT NOT NULL,
    "document_type" VARCHAR(50) NOT NULL,
    "document_name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "document_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "media_files_entity_id_idx" ON "media_files"("entity_id");

-- CreateIndex
CREATE UNIQUE INDEX "image_attributes_media_file_id_key" ON "image_attributes"("media_file_id");

-- CreateIndex
CREATE UNIQUE INDEX "document_attributes_media_file_id_key" ON "document_attributes"("media_file_id");

-- AddForeignKey
ALTER TABLE "image_attributes" ADD CONSTRAINT "image_attributes_media_file_id_fkey" FOREIGN KEY ("media_file_id") REFERENCES "media_files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_attributes" ADD CONSTRAINT "document_attributes_media_file_id_fkey" FOREIGN KEY ("media_file_id") REFERENCES "media_files"("id") ON DELETE CASCADE ON UPDATE CASCADE;
