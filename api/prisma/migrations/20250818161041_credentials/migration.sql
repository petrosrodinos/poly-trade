-- CreateEnum
CREATE TYPE "public"."CredentialsType" AS ENUM ('BINANCE');

-- CreateTable
CREATE TABLE "public"."Credentials" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "user_uuid" TEXT NOT NULL,
    "type" "public"."CredentialsType" NOT NULL DEFAULT 'BINANCE',
    "api_key" TEXT NOT NULL,
    "api_secret" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Credentials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Credentials_uuid_key" ON "public"."Credentials"("uuid");
