import { Controller, Get, HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SuccessMessageConstant } from '../../../shared/constants/message.constant';
import { IBasicResponse } from '../../../shared/interfaces/basic-response.interface';
import { GetClientLogged } from '../../../shared/decorators/get-client-logged.decorator';
import { JwtAuthTypeEnum } from '../../../infrastructures/modules/jwt/enums/jwt-type.enum';
import { UsageV1Service } from '../services/usage-v1.service';
import { UsageDailyV1Response } from '../dtos/responses/usage-daily-v1.response';
import { UsageTopV1Response } from '../dtos/responses/usage-top-v1.response';
import { Client } from '../../../infrastructures/database/entities/client.entity';

@ApiTags('Usages')
@ApiBearerAuth(JwtAuthTypeEnum.AccessToken)
@Controller({
  path: 'usages',
  version: '1',
})
export class UsageV1Controller {
  constructor(private readonly usageV1Service: UsageV1Service) {}

  @Get('daily')
  @ApiOperation({
    summary: 'Get daily usage statistics',
    description:
      'Fetch total daily requests for the logged-in client for the last 7 days',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Daily usage statistics retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  async getDailyUsage(
    @GetClientLogged() client: Client,
  ): Promise<IBasicResponse<UsageDailyV1Response[]>> {
    const data = await this.usageV1Service.getDailyUsage(client.id);

    return {
      message: SuccessMessageConstant.EntitiesRetrieved(
        'Daily usage statistics',
      ),
      data: UsageDailyV1Response.MapDataList(data),
    };
  }

  @Get('top')
  @ApiOperation({
    summary: 'Get top clients by requests',
    description:
      'Fetch the top 3 clients with the highest total requests in the last 24 hours',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Top clients retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  async getTopClients(): Promise<IBasicResponse<UsageTopV1Response[]>> {
    const data = await this.usageV1Service.getTopClients();

    return {
      message: SuccessMessageConstant.EntitiesRetrieved('Top clients'),
      data: UsageTopV1Response.MapDataList(data),
    };
  }
}
