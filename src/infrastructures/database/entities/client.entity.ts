import { Entity, Column, Index, BeforeInsert, BeforeUpdate } from 'typeorm';
import { BaseEntity } from './base.entity';
import { HashUtil } from '../../../shared/utils/hash.util';

@Entity('clients')
export class Client extends BaseEntity {
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
}
