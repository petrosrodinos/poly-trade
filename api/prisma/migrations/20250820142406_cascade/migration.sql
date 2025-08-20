-- DropForeignKey
ALTER TABLE "public"."BotSubscription" DROP CONSTRAINT "BotSubscription_user_uuid_fkey";

-- AddForeignKey
ALTER TABLE "public"."BotSubscription" ADD CONSTRAINT "BotSubscription_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "public"."User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
