import { Handler, NextFunction } from "express";
import { INestApplicationContext } from "@nestjs/common";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { ConfigService } from "@nestjs/config";

import { ServerOptions } from "socket.io";
import { createAdapter } from "socket.io-redis";
import passport from "passport";

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
    const nodeEnv = configService.get<string>("NODE_ENV", "development");

    const server = super.createIOServer(port, {
      ...options,
      pingInterval: 1000,
      pingTimeout: 5000,
      cors: {
        origin:
          nodeEnv === "development" || nodeEnv === "dev"
            ? ["http://localhost:3002", "http://localhost:3004", "http://localhost:3006"]
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
