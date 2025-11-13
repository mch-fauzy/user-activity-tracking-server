export class MaskUtil {
  /**
   * Masks an email address
   * Example: john.doe@example.com -> j*******@example.com
   */
  static email(email: string): string {
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return email;
    }

    const [localPart, domain] = email.split('@');

    if (!localPart || !domain) {
      return email;
    }

    // If local part is 1 character, mask it completely
    if (localPart.length === 1) {
      return `*@${domain}`;
    }

    // Show first character, mask the rest
    const firstChar = localPart.charAt(0);
    const maskLength = localPart.length - 1;
    const maskedPart = '*'.repeat(maskLength);

    return `${firstChar}${maskedPart}@${domain}`;
  }
}
