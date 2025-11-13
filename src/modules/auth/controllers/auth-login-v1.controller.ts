import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SuccessMessageConstant } from '../../../shared/constants/message.constant';
import { IBasicResponse } from '../../../shared/interfaces/basic-response.interface';
import { Public } from '../../../shared/decorators/public.decorator';
import { AuthLoginV1Request } from '../dtos/requests/auth-login-v1.request';
import { AuthV1Response } from '../dtos/responses/auth-v1.response';
import { AuthLoginV1Service } from '../services/auth-login-v1.service';

@ApiTags('Auth')
@Controller({
  path: 'auth/login',
  version: '1',
})
@Public()
export class AuthLoginV1Controller {
  constructor(private readonly authLoginService: AuthLoginV1Service) {}

  @Post()
  @ApiOperation({
    summary: 'Login with email and password',
    description:
      'Authenticate a client using email and password. Returns client information and JWT access token.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login successful',
    type: AuthV1Response,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation error',
  })
  async login(
    @Body() request: AuthLoginV1Request,
  ): Promise<IBasicResponse<AuthV1Response>> {
    const result = await this.authLoginService.login(request);

    return {
      message: SuccessMessageConstant.Action('Login'),
      data: AuthV1Response.MapEntity(result),
    };
  }
}
