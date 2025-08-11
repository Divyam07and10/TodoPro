/*
  Warnings:

  - The values [WORK,PERSONAL,HEALTH,FINANCE,EDUCATION,OTHER] on the enum `Category` will be removed. If these variants are still used in the database, this will fail.
  - The values [HIGH,MEDIUM,LOW] on the enum `Priority` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Category_new" AS ENUM ('Work', 'Personal', 'Health', 'Finance', 'Education', 'Other');
ALTER TABLE "Todo" ALTER COLUMN "category" TYPE "Category_new" USING ("category"::text::"Category_new");
ALTER TYPE "Category" RENAME TO "Category_old";
ALTER TYPE "Category_new" RENAME TO "Category";
DROP TYPE "Category_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Priority_new" AS ENUM ('High', 'Medium', 'Low');
ALTER TABLE "Todo" ALTER COLUMN "priority" TYPE "Priority_new" USING ("priority"::text::"Priority_new");
ALTER TYPE "Priority" RENAME TO "Priority_old";
ALTER TYPE "Priority_new" RENAME TO "Priority";
DROP TYPE "Priority_old";
COMMIT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT;
