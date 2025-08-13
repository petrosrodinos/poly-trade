/*
  Warnings:

  - You are about to drop the column `amount` on the `Bot` table. All the data in the column will be lost.
  - You are about to drop the column `leverage` on the `Bot` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Bot" DROP COLUMN "amount",
DROP COLUMN "leverage";

-- CreateTable
CREATE TABLE "public"."BotSubscription" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "bot_id" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "leverage" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BotSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BotSubscription_uuid_key" ON "public"."BotSubscription"("uuid");

-- AddForeignKey
ALTER TABLE "public"."BotSubscription" ADD CONSTRAINT "BotSubscription_bot_id_fkey" FOREIGN KEY ("bot_id") REFERENCES "public"."Bot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BotSubscription" ADD CONSTRAINT "BotSubscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
