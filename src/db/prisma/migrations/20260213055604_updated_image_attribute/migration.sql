/*
  Warnings:

  - You are about to drop the column `alt_text` on the `image_attributes` table. All the data in the column will be lost.
  - You are about to drop the column `display_order` on the `image_attributes` table. All the data in the column will be lost.
  - You are about to drop the column `height_px` on the `image_attributes` table. All the data in the column will be lost.
  - You are about to drop the column `width_px` on the `image_attributes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "image_attributes" DROP COLUMN "alt_text",
DROP COLUMN "display_order",
DROP COLUMN "height_px",
DROP COLUMN "width_px",
ADD COLUMN     "image_name" VARCHAR(255);
