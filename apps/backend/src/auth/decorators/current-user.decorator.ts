import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../models/jwt-payload';

export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext): JwtPayload => {
    const request = context.switchToHttp().getRequest<{ user: JwtPayload }>();

    return request.user;
  },
);
