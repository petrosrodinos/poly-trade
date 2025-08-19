-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "meta" JSONB;

-- AddForeignKey
ALTER TABLE "public"."Credentials" ADD CONSTRAINT "Credentials_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "public"."User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
