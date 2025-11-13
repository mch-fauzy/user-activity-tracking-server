import { ConflictException, Injectable } from '@nestjs/common';
import { ErrorMessageConstant } from '../../../shared/constants/message.constant';
import { AuthRegisterV1Request } from '../dtos/requests/auth-register-v1.request';
import { ClientV1Repository } from '../../client/repositories/client-v1.repository';
import { AuthV1Service } from './auth-v1.service';

@Injectable()
export class AuthRegisterV1Service {
  constructor(
    private readonly authService: AuthV1Service,
    private readonly clientV1Repository: ClientV1Repository,
  ) {}

  /**
   * Registers a new client
   */
  async register(request: AuthRegisterV1Request): Promise<{ apiKey: string }> {
    // Check if email already exists
    const existingClient = await this.clientV1Repository.findOneByEmail(
      request.email,
    );

    if (existingClient) {
      throw new ConflictException(
        ErrorMessageConstant.DataEntityFieldAlreadyExists('client', 'email'),
      );
    }

    // Generate API key
    const plainApiKey = this.authService.generateApiKey();

    // Create new client
    const client = this.clientV1Repository.create({
      ...request,
      apiKey: plainApiKey,
    });

    // Save client to database
    await this.clientV1Repository.save(client);

    // Return the plain API key
    return { apiKey: plainApiKey };
  }
}
