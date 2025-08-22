import { v4 as uuidv4 } from 'uuid';
import prisma from '../../core/prisma/prisma-client';
import { CreateCredentialsDto, CredentialsResponse } from './dto/credentials.dto';
import { EncryptionService } from '../../shared/utils/encryption';
import { AccountService } from '../account/account.service';
import { BinanceAccountService } from '../../integrations/binance/services/binance-account.service';

export class CredentialsService {
    private prisma: any;
    private encryptionService: EncryptionService;


    constructor() {
        this.prisma = prisma;
        this.encryptionService = new EncryptionService();
    }

    async createCredentials(data: CreateCredentialsDto, user_uuid: string): Promise<CredentialsResponse> {
        try {
            const existingCredentials = await this.prisma.credentials.findFirst({
                where: {
                    user_uuid: user_uuid,
                    type: data.type
                }
            });

            if (existingCredentials) {
                throw new Error(`Credentials of type ${data.type} already exist for this user`);
            }


            const encryptedApiKey = await this.encryptionService.encrypt(data.api_key);
            const encryptedApiSecret = await this.encryptionService.encrypt(data.api_secret);

            const credentials = await this.prisma.credentials.create({
                data: {
                    uuid: uuidv4(),
                    user_uuid: user_uuid,
                    type: data.type,
                    api_key: encryptedApiKey,
                    api_secret: encryptedApiSecret
                }
            });

            const binanceAccountService = new BinanceAccountService();

            const account = await binanceAccountService.getAccountFutures(user_uuid);

            if (account?.totalWalletBalance === '0' || !account) {
                await this.prisma.credentials.delete({
                    where: {
                        uuid: credentials.uuid
                    }
                });

                throw new Error('Account balance is 0, please transfer funds to your futures account');
            }

            await this.prisma.user.update({
                where: {
                    uuid: user_uuid
                },
                data: {
                    verified: true
                }
            });

            return credentials;
        } catch (error) {
            console.log(error);
            await this.prisma.credentials.delete({
                where: {
                    user_uuid: user_uuid
                }
            });
            throw new Error('Invalid API key or secret');
        }
    }

    async getAllCredentials(): Promise<CredentialsResponse[]> {
        try {
            const credentials = await this.prisma.credentials.findMany({
                select: {
                    uuid: true,
                    user_uuid: true,
                    api_key: true,
                    api_secret: true,
                    type: true,
                }
            });

            return credentials;
        } catch (error) {
            throw error;
        }
    }


    async deleteCredential(uuid: string): Promise<CredentialsResponse | null> {
        try {
            const existingCredentials = await this.prisma.credentials.findFirst({
                where: {
                    uuid: uuid,
                }
            });

            if (!existingCredentials) {
                throw new Error('Credentials not found');
            }

            const credentials = await this.prisma.credentials.delete({
                where: {
                    uuid: uuid
                }
            });

            await this.prisma.user.update({
                where: {
                    uuid: existingCredentials.user_uuid
                },
                data: {
                    verified: false
                }
            });

            return credentials;
        } catch (error) {
            throw error;
        }
    }

    async deleteAllCredentials(): Promise<boolean> {
        try {
            await this.prisma.credentials.deleteMany();

            return true;
        } catch (error) {
            throw error;
        }
    }

    async getUserCredential(user_uuid: string): Promise<CredentialsResponse | null> {
        try {
            const where = {
                user_uuid: user_uuid
            };

            const credential = await this.prisma.credentials.findFirst({
                where,
            });


            return credential;
        } catch (error) {
            throw error;
        }
    }

}
