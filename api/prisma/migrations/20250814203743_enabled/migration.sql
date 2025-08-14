/*
  Warnings:

  - A unique constraint covering the columns `[strategy,symbol,timeframe]` on the table `Bot` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[bot_uuid,user_uuid]` on the table `BotSubscription` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Bot" ADD COLUMN     "strategy" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "public"."BotSubscription" ADD COLUMN     "enabled" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "enabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Bot_strategy_symbol_timeframe_key" ON "public"."Bot"("strategy", "symbol", "timeframe");

-- CreateIndex
CREATE UNIQUE INDEX "BotSubscription_bot_uuid_user_uuid_key" ON "public"."BotSubscription"("bot_uuid", "user_uuid");
