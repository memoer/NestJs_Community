/*
  Warnings:

  - You are about to drop the column `tag` on the `Comment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "tag",
ADD COLUMN     "tags" JSONB;
