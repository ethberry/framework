import {createParamDecorator, ExecutionContext} from "@nestjs/common";

import {IUser} from "@gemunionstudio/solo-types";

export const User = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return (request.user as IUser) || null;
});
