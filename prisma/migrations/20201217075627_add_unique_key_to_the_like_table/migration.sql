/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[userId,postId]` on the table `Like`. If there are existing duplicate values, the migration will fail.
  - The migration will add a unique constraint covering the columns `[name,email]` on the table `User`. If there are existing duplicate values, the migration will fail.

*/
-- DropIndex
DROP INDEX "User.email_unique";

-- DropIndex
DROP INDEX "User.name_unique";

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_postId_unique_constraint" ON "Like"("userId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "User_name_email_unique_constraint" ON "User"("name", "email");
