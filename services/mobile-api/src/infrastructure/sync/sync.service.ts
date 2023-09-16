import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { map } from "rxjs";

import { IBalance } from "@framework/types";

@Injectable()
export class SyncService {
  constructor(
    private httpService: HttpService,
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
  ) {}

  public async getProfile(sub: string): Promise<Record<string, any> | undefined> {
    const gameMicroserviceAddress = this.configService.get<string>(
      "GAME_MICROSERVICE_ADDRESS",
      "http://localhost:3012",
    );

    const merchantApiKey = this.configService.get<string>("MERCHANT_API_KEY", "11111111-2222-3333-4444-555555555555");

    return this.httpService
      .get<Record<string, any>>(`${gameMicroserviceAddress}/sync/${sub}/profile`, {
        headers: {
          Authorization: `Bearer ${merchantApiKey}`,
        },
      })
      .pipe(map(({ data }) => data))
      .toPromise();
  }

  public async getBalance(sub: string): Promise<Array<IBalance> | undefined> {
    const gameMicroserviceAddress = this.configService.get<string>(
      "GAME_MICROSERVICE_ADDRESS",
      "http://localhost:3012",
    );

    const merchantApiKey = this.configService.get<string>("MERCHANT_API_KEY", "11111111-2222-3333-4444-555555555555");

    return this.httpService
      .get<Array<IBalance>>(`${gameMicroserviceAddress}/sync/${sub}/balance`, {
        headers: {
          Authorization: `Bearer ${merchantApiKey}`,
        },
      })
      .pipe(map(({ data }) => data))
      .toPromise();
  }
}
