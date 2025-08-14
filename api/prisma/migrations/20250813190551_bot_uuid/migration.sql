/*
  Warnings:

  - You are about to drop the column `bot_id` on the `BotSubscription` table. All the data in the column will be lost.
  - Added the required column `bot_uuid` to the `BotSubscription` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."BotSubscription" DROP CONSTRAINT "BotSubscription_bot_id_fkey";

-- AlterTable
ALTER TABLE "public"."BotSubscription" DROP COLUMN "bot_id",
ADD COLUMN     "bot_uuid" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."BotSubscription" ADD CONSTRAINT "BotSubscription_bot_uuid_fkey" FOREIGN KEY ("bot_uuid") REFERENCES "public"."Bot"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
