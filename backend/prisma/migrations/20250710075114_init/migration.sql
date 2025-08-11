/*
  Warnings:

  - The values [Work,Personal,Health,Finance,Education,Other] on the enum `Category` will be removed. If these variants are still used in the database, this will fail.
  - The values [High,Medium,Low] on the enum `Priority` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `status` on the `Todo` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Category_new" AS ENUM ('work', 'personal', 'health', 'finance', 'education', 'other');
ALTER TABLE "Todo" ALTER COLUMN "category" TYPE "Category_new" USING ("category"::text::"Category_new");
ALTER TYPE "Category" RENAME TO "Category_old";
ALTER TYPE "Category_new" RENAME TO "Category";
DROP TYPE "Category_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Priority_new" AS ENUM ('high', 'medium', 'low');
ALTER TABLE "Todo" ALTER COLUMN "priority" TYPE "Priority_new" USING ("priority"::text::"Priority_new");
ALTER TYPE "Priority" RENAME TO "Priority_old";
ALTER TYPE "Priority_new" RENAME TO "Priority";
DROP TYPE "Priority_old";
COMMIT;

-- AlterTable
ALTER TABLE "Todo" DROP COLUMN "status",
ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false;
