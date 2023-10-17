import { Handler, NextFunction } from "express";
import { INestApplicationContext } from "@nestjs/common";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { ConfigService } from "@nestjs/config";
import { ServerOptions } from "socket.io";
import { createAdapter } from "socket.io-redis";
import passport from "passport";

import { NodeEnv } from "@framework/types";

const adapter = (middleware: Handler) => (socket: any, next: NextFunction) => {
  middleware(socket.request, socket.request.res || {}, next);
};

export class RedisIoAdapter extends IoAdapter {
  constructor(private readonly app: INestApplicationContext) {
    super(app);
  }

  createIOServer(port: number, options: Partial<ServerOptions> = {}): any {
    const configService = this.app.get(ConfigService);

    const baseUrl = configService.get<string>("PUBLIC_FE_URL", "http://localhost:3005");
    const nodeEnv = configService.get<NodeEnv>("NODE_ENV", NodeEnv.development);

    const server = super.createIOServer(port, {
      ...options,
      pingInterval: 1000,
      pingTimeout: 5000,
      cors: {
        origin:
          nodeEnv === NodeEnv.development
            ? [
                "http://localhost:3005",
                "http://127.0.0.1:3005",
                "http://0.0.0.0:3005",
                "http://localhost:3009",
                "http://127.0.0.1:3009",
                "http://0.0.0.0:3009",
              ]
            : [baseUrl],
      },
    });

    const redisUrl = configService.get<string>("REDIS_WS_URL", "redis://127.0.0.1:6379/");
    const redisAdapter = createAdapter(redisUrl);
    server.adapter(redisAdapter);

    // https://github.com/nestjs/nest/issues/1254
    // https://github.com/nestjs/nest/issues/1059

    server.use(adapter(passport.initialize()));

    return server;
  }
}
