import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiSecurity,
} from '@nestjs/swagger';
import { SuccessMessageConstant } from '../../../shared/constants/message.constant';
import { IBasicResponse } from '../../../shared/interfaces/basic-response.interface';
import { GetClientLogged } from '../../../shared/decorators/get-client-logged.decorator';
import { LogCreateV1Request } from '../dtos/requests/log-create-v1.request';
import { LogBatchV1Service } from '../services/log-batch-v1.service';
import { Client } from '../../../infrastructures/database/entities/client.entity';
import { ApiKeyAuthGuard } from '../../../infrastructures/modules/api-key/guards/api-key-auth.guard';
import { ApiKeyAuthTypeEnum } from '../../../infrastructures/modules/api-key/enums/api-key-type.enum';
import { Public } from '../../../shared/decorators/public.decorator';

@ApiTags('Logs')
@ApiSecurity(ApiKeyAuthTypeEnum.ApiKey)
@Controller({
  path: 'logs',
  version: '1',
})
@Public() // Exclude from global JWT auth
@UseGuards(ApiKeyAuthGuard) // Use API key auth instead
export class LogV1Controller {
  constructor(private readonly logBatchV1Service: LogBatchV1Service) {}

  @Post()
  @ApiOperation({
    summary: 'Record an API hit log',
    description:
      'Record an API hit with details including IP address, endpoint, method, and timestamp. Requires API key authentication via Bearer token',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Log recorded successfully (queued for batch processing)',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: HttpStatus.TOO_MANY_REQUESTS,
    description: 'Rate limit exceeded',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation error',
  })
  async createLog(
    @Body() request: LogCreateV1Request,
    @GetClientLogged() client: Client,
  ): Promise<IBasicResponse<null>> {
    // Add to batch queue
    await this.logBatchV1Service.addToQueue(client.id, client.apiKey, request);

    return {
      message: SuccessMessageConstant.EntityCreated('Log'),
      data: null,
    };
  }
}
