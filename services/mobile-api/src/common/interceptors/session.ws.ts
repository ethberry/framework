import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { InjectRedis } from "@liaoliaots/nestjs-redis";
import Redis from "ioredis";

import { RedisProviderType } from "@framework/types";

@Injectable()
export class SessionInterceptor implements NestInterceptor {
  constructor(
    @InjectRedis(RedisProviderType.STORAGE)
    private readonly redisClient: Redis,
  ) {}

  public async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const sessionData = await this.redisClient.get(request.user.sub);
    request.session = sessionData ? JSON.parse(sessionData) : {};
    return next.handle().pipe(
      finalize(() => {
        // https://github.com/ReactiveX/rxjs/issues/4222
        void this.redisClient.set(request.user.sub, JSON.stringify(request.session));
      }),
    );
  }
}
