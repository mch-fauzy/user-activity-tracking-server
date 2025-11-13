import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../../../infrastructures/database/entities/client.entity';

@Injectable()
export class ClientV1Repository extends Repository<Client> {
  constructor(
    @InjectRepository(Client)
    repo: Repository<Client>,
  ) {
    super(repo.target, repo.manager, repo.queryRunner);
  }

  async findOneByEmail(email: string): Promise<Client | null> {
    return await this.findOne({
      where: { email },
    });
  }

  async findOneById(id: string): Promise<Client | null> {
    return await this.findOne({
      where: { id },
    });
  }
}
