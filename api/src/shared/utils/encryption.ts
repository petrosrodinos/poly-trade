import * as crypto from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(crypto.scrypt);

export class EncryptionService {
    private readonly ALGORITHM = 'aes-256-cbc';
    private readonly KEY_LENGTH = 32;
    private readonly IV_LENGTH = 16;
    private readonly SALT_LENGTH = 16;

    private getEncryptionKey(): string {
        return process.env.ENCRYPTION_KEY || '';
    }

    async encrypt(text: string): Promise<string> {
        try {
            const salt = crypto.randomBytes(this.SALT_LENGTH);
            const iv = crypto.randomBytes(this.IV_LENGTH);

            const key = await scryptAsync(this.getEncryptionKey(), salt, this.KEY_LENGTH) as Buffer;

            const cipher = crypto.createCipheriv(this.ALGORITHM, key, iv);

            let encrypted = cipher.update(text, 'utf8', 'hex');
            encrypted += cipher.final('hex');

            const result = salt.toString('hex') + ':' + iv.toString('hex') + ':' + encrypted;

            return result;
        } catch (error) {
            throw new Error(`Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async decrypt(encryptedData: string): Promise<string> {
        try {
            const parts = encryptedData.split(':');
            if (parts.length !== 3) {
                throw new Error('Invalid encrypted data format');
            }

            const [saltHex, ivHex, encryptedHex] = parts;

            const salt = Buffer.from(saltHex, 'hex');
            const iv = Buffer.from(ivHex, 'hex');
            const encrypted = encryptedHex;

            const key = await scryptAsync(this.getEncryptionKey(), salt, this.KEY_LENGTH) as Buffer;

            const decipher = crypto.createDecipheriv(this.ALGORITHM, key, iv);

            let decrypted = decipher.update(encrypted, 'hex', 'utf8');
            decrypted += decipher.final('utf8');

            return decrypted;
        } catch (error) {
            throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
