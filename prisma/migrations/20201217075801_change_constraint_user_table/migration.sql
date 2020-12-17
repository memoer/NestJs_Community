/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[name]` on the table `User`. If there are existing duplicate values, the migration will fail.
  - The migration will add a unique constraint covering the columns `[email]` on the table `User`. If there are existing duplicate values, the migration will fail.

*/
-- DropIndex
DROP INDEX "User_name_email_unique_constraint";

-- CreateIndex
CREATE UNIQUE INDEX "User.name_unique" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");
