/*
  Warnings:

  - You are about to drop the column `amount` on the `Wallet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Wallet" DROP COLUMN "amount",
ADD COLUMN     "balance" INTEGER NOT NULL DEFAULT 0;
