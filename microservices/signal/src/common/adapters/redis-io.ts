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

    const nodeEnv = configService.get<NodeEnv>("NODE_ENV", NodeEnv.development);
    const adminB2BBaseUrl = configService.get<string>("ADMIN_FE_URL_B2B", "http://localhost:3005");
    const adminB2BCaseUrl = configService.get<string>("ADMIN_FE_URL_B2C", "http://localhost:3005");
    const marketB2BBaseUrl = configService.get<string>("MARKET_FE_URL_B2B", "http://localhost:3005");
    const marketB2CBaseUrl = configService.get<string>("MARKET_FE_URL_B2B", "http://localhost:3005");
    const officeBaseUrl = configService.get<string>("OFFICE_FE_URL", "http://localhost:3005");
    const baseUrl = configService.get<string>("PUBLIC_FE_URL", "http://localhost:3005");
    const ioAdminUrl = configService.get<string>("SIGNAL_FE_URL", "http://localhost:3015");

    const server = super.createIOServer(port, {
      ...options,
      pingInterval: 1000,
      pingTimeout: 5000,
      cors: {
        credentials: true,
        origin:
          nodeEnv === NodeEnv.development
            ? ["https://admin.socket.io", "http://localhost:3002", "http://localhost:3004", "http://localhost:3006"]
            : [
                adminB2BBaseUrl,
                adminB2BCaseUrl,
                marketB2BBaseUrl,
                marketB2CBaseUrl,
                officeBaseUrl,
                baseUrl,
                ioAdminUrl,
              ],
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
