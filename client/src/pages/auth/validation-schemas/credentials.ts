import { z } from "zod";
import { CredentialsType as CredentialsTypeEnum } from "@/features/credentials/interfaces/credentials.interface";

export const CredentialsTypeSchema = z.enum(["BINANCE"]);

export const CredentialsSchema = z.object({
    api_key: z
        .string()
        .min(1, { message: "Please enter your API key" })
        .min(4, { message: "API key must be at least 64 characters long" }),
    api_secret: z
        .string()
        .min(1, { message: "Please enter your API secret" })
        .min(4, { message: "API secret must be at least 64 characters long" }),
    type: CredentialsTypeSchema.default(CredentialsTypeEnum.BINANCE),
});
