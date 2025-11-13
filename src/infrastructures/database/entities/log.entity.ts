import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { Base } from './base.entity';
import { Client } from './client.entity';

@Entity('logs')
@Index(['clientId', 'createdAt']) // Composite index for analytics queries
@Index(['apiKey', 'createdAt']) // Composite index for API key lookups
export class Log extends Base {
  @Index()
  @Column({ type: 'uuid' })
  clientId: string;

  @ManyToOne(() => Client, { nullable: false })
  @JoinColumn({ name: 'client_id' })
  client?: Client;

  @Index()
  @Column()
  apiKey: string;

  @Column()
  ipAddress: string;

  @Column()
  endpoint: string;

  @Column()
  method: string;

  @Column({ type: 'bigint' })
  timestamp: number; // Unix timestamp in milliseconds
}
