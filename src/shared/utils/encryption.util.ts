import * as crypto from 'crypto';
import { config } from '../../config';

export class EncryptionUtils {
  private static readonly algorithm = 'aes-256-cbc';
  private static readonly key = crypto
    .createHash('sha256')
    .update(config.encryption.secret)
    .digest();

  /**
   * Encrypt a string deterministically using AES-256-CBC
   */
  static encryptDeterministic(text: string): string {
    // Derive IV from the text itself for deterministic encryption
    const iv = crypto
      .createHash('md5')
      .update(text + config.encryption.secret)
      .digest();
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  /**
   * Decrypt a string using AES-256-CBC
   */
  static decrypt(text: string): string {
    const parts = text.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = parts[1];
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  /**
   * Compare plain text with encrypted text
   */
  static compareEncrypted(plainText: string, encryptedText: string): boolean {
    try {
      const decrypted = this.decrypt(encryptedText);
      return plainText === decrypted;
    } catch {
      return false;
    }
  }
}
