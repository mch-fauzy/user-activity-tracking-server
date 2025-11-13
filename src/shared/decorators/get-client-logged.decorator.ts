import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Client } from '../../infrastructures/database/entities/client.entity';

export const GetClientLogged = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): Client => {
    const request = ctx.switchToHttp().getRequest<{ user: Client }>();
    return request.user;
  },
);
