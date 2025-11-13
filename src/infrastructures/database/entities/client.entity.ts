import { Entity, Column, Index, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Base } from './base.entity';
import { HashUtil } from '../../../shared/utils/hash.util';
import { EncryptionUtils } from '../../../shared/utils/encryption.util';

@Entity('clients')
export class Client extends Base {
  @Column()
  name: string;

  @Index()
  @Column()
  email: string;

  @Index()
  @Column()
  apiKey: string;

  @Column()
  password: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      this.password = await HashUtil.hashBcryptPassword(this.password);
    }
  }

  @BeforeInsert()
  encryptApiKey(): void {
    if (this.apiKey) {
      this.apiKey = EncryptionUtils.encryptDeterministic(this.apiKey);
    }
  }
}
