import { BadGatewayException, Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { map } from "rxjs";
import { MerchantEntity } from "../merchant.entity";

@Injectable()
export class RmqService {
  constructor(
    private httpService: HttpService,
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
  ) {}

  public async setMerchant(merchant: MerchantEntity): Promise<Record<string, any> | undefined> {
    const rmqAdminAddr = this.configService.get<string>("RMQ_ADMIN_URL", "http://localhost:15672");
    const rmqAdminLogin = this.configService.get<string>("RMQ_ADMIN_LOGIN", "admin:password");
    const rmqUserPasswordHash = await this.getMerchantPasswordHash(merchant.apiKey);
    const rmqUserName = `merchant${merchant.id}`;

    // MUST GET HASH
    if (rmqUserPasswordHash && rmqUserPasswordHash.ok && rmqUserPasswordHash.ok.length > 1) {
      return this.httpService
        .post<Record<string, any>>(
          // URL
          `${rmqAdminAddr}/api/definitions`,
          // DATA
          {
            users: [
              {
                name: rmqUserName,
                password_hash: rmqUserPasswordHash ? rmqUserPasswordHash.ok : "111",
                hashing_algorithm: "rabbit_password_hashing_sha256",
                tags: ["merchant"],
                limits: {},
              },
            ],
            permissions: [
              {
                user: rmqUserName,
                vhost: "merchant",
                configure: `${rmqUserName}.*`,
                write: "",
                read: `${rmqUserName}.*`,
              },
            ],
          },
          // CONFIG
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${Buffer.from(rmqAdminLogin).toString("base64")}`,
            },
          },
        )
        .pipe(map(({ data }) => data))
        .toPromise();
    } else {
      throw new BadGatewayException("ErrorCreateRmqMerchant");
    }
  }

  public async getMerchantPasswordHash(password: string): Promise<Record<string, any> | undefined> {
    const rmqAddress = this.configService.get<string>("RMQ_ADMIN_URL", "http://localhost:15672");
    const rmqAdminLogin = this.configService.get<string>("RMQ_ADMIN_LOGIN", "admin:password");

    return this.httpService
      .get<Record<string, any>>(
        // URL
        `${rmqAddress}/api/auth/hash_password/${password}`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(rmqAdminLogin).toString("base64")}`,
          },
        },
      )
      .pipe(map(({ data }) => data))
      .toPromise();
  }
}
