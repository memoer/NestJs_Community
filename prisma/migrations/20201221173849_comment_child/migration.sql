/*
  Warnings:

  - You are about to drop the column `parentId` on the `Comment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_parentId_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "parentId",
ADD COLUMN     "commentId" INTEGER;

-- AddForeignKey
ALTER TABLE "Comment" ADD FOREIGN KEY("commentId")REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
