import { v4 as uuidv4 } from 'uuid';
import prisma from '../../core/prisma/prisma-client';
import { CreateCredentialsDto, UpdateCredentialsDto, CredentialsQueryDto, CredentialsResponse } from './dto/credentials.dto';
import { EncryptionService } from '../../shared/utils/encryption';

export class CredentialsService {
    private prisma: any;

    constructor() {
        this.prisma = prisma;
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

            const encryptedApiKey = await EncryptionService.encrypt(data.api_key);
            const encryptedApiSecret = await EncryptionService.encrypt(data.api_secret);

            const credentials = await this.prisma.credentials.create({
                data: {
                    uuid: uuidv4(),
                    user_uuid: user_uuid,
                    type: data.type,
                    api_key: encryptedApiKey,
                    api_secret: encryptedApiSecret
                }
            });

            await this.prisma.user.update({
                where: {
                    uuid: user_uuid
                },
                data: {
                    verified: true
                }
            });

            return {
                ...credentials,
                api_key: data.api_key,
                api_secret: data.api_secret
            };
        } catch (error) {
            throw error;
        }
    }

    async getAllCredentials(query: CredentialsQueryDto, user_uuid: string): Promise<CredentialsResponse[]> {
        try {
            const where: any = {
                user_uuid: user_uuid
            };

            if (query.type) {
                where.type = query.type;
            }

            const [credentials] = await Promise.all([
                this.prisma.credentials.findMany({
                    where,
                    select: {
                        uuid: true,
                        user_uuid: true,
                        type: true,
                        createdAt: true,
                        updatedAt: true
                    }
                }),
            ]);


            return credentials
        } catch (error) {
            throw error;
        }
    }


    async updateCredentials(uuid: string, data: UpdateCredentialsDto, user_uuid: string): Promise<CredentialsResponse | null> {
        try {
            const existingCredentials = await this.prisma.credentials.findFirst({
                where: {
                    uuid: uuid,
                    user_uuid: user_uuid
                }
            });

            if (!existingCredentials) {
                throw new Error('Credentials not found');
            }

            if (data.type && data.type !== existingCredentials.type) {
                const duplicateCredentials = await this.prisma.credentials.findFirst({
                    where: {
                        user_uuid: user_uuid,
                        type: data.type,
                        uuid: {
                            not: uuid
                        }
                    }
                });

                if (duplicateCredentials) {
                    throw new Error(`Credentials of type ${data.type} already exist for this user`);
                }
            }

            const updateData: any = {
                updatedAt: new Date()
            };

            if (data.type) {
                updateData.type = data.type;
            }

            if (data.api_key) {
                updateData.api_key = await EncryptionService.encrypt(data.api_key);
            }

            if (data.api_secret) {
                updateData.api_secret = await EncryptionService.encrypt(data.api_secret);
            }

            const credentials = await this.prisma.credentials.update({
                where: {
                    uuid: uuid
                },
                data: updateData
            });

            return {
                ...credentials,
                api_key: await EncryptionService.decrypt(credentials.api_key),
                api_secret: await EncryptionService.decrypt(credentials.api_secret)
            };
        } catch (error) {
            throw error;
        }
    }

    async deleteCredential(uuid: string, user_uuid: string): Promise<CredentialsResponse | null> {
        try {
            const existingCredentials = await this.prisma.credentials.findFirst({
                where: {
                    uuid: uuid,
                    user_uuid: user_uuid
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

            if (credential) {
                return {
                    ...credential,
                    api_key: await EncryptionService.decrypt(credential.api_key),
                    api_secret: await EncryptionService.decrypt(credential.api_secret)
                };
            }

            return credential;
        } catch (error) {
            throw error;
        }
    }

}
