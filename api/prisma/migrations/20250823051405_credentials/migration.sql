-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."CredentialsType" ADD VALUE 'ALPACA';
ALTER TYPE "public"."CredentialsType" ADD VALUE 'COINBASE';
ALTER TYPE "public"."CredentialsType" ADD VALUE 'KRAKEN';
ALTER TYPE "public"."CredentialsType" ADD VALUE 'MEXC';
ALTER TYPE "public"."CredentialsType" ADD VALUE 'BYBIT';

-- AlterTable
ALTER TABLE "public"."Credentials" ADD COLUMN     "passphrase" TEXT;
