/*
  Warnings:

  - You are about to drop the column `user_id` on the `Bot` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `BotSubscription` table. All the data in the column will be lost.
  - Added the required column `user_uuid` to the `Bot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_uuid` to the `BotSubscription` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Bot" DROP CONSTRAINT "Bot_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."BotSubscription" DROP CONSTRAINT "BotSubscription_bot_uuid_fkey";

-- DropForeignKey
ALTER TABLE "public"."BotSubscription" DROP CONSTRAINT "BotSubscription_user_id_fkey";

-- AlterTable
ALTER TABLE "public"."Bot" DROP COLUMN "user_id",
ADD COLUMN     "user_uuid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."BotSubscription" DROP COLUMN "user_id",
ADD COLUMN     "user_uuid" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Bot" ADD CONSTRAINT "Bot_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "public"."User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BotSubscription" ADD CONSTRAINT "BotSubscription_bot_uuid_fkey" FOREIGN KEY ("bot_uuid") REFERENCES "public"."Bot"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BotSubscription" ADD CONSTRAINT "BotSubscription_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "public"."User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
