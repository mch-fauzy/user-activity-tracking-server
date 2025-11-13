import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SuccessMessageConstant } from '../../../shared/constants/message.constant';
import { IBasicResponse } from '../../../shared/interfaces/basic-response.interface';
import { Public } from '../../../shared/decorators/public.decorator';
import { AuthRegisterV1Request } from '../dtos/requests/auth-register-v1.request';
import { AuthRegisterV1Service } from '../services/auth-register-v1.service';

@ApiTags('Auth')
@Controller({
  path: 'auth/register',
  version: '1',
})
@Public()
export class AuthRegisterV1Controller {
  constructor(private readonly authRegisterService: AuthRegisterV1Service) {}

  @Post()
  @ApiOperation({
    summary: 'Register a new client',
    description:
      'Register a new client with name, email, and password. An API key will be generated automatically.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Client registered successfully',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email already exists',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation error',
  })
  async register(
    @Body() request: AuthRegisterV1Request,
  ): Promise<IBasicResponse<null>> {
    await this.authRegisterService.register(request);

    return {
      message: SuccessMessageConstant.EntityCreated('Client'),
      data: null,
    };
  }
}
