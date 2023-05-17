import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { map } from "rxjs";

import { IBalance } from "@framework/types";

import { MerchantService } from "../merchant/merchant.service";

@Injectable()
export class SyncService {
  constructor(
    private httpService: HttpService,
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    private readonly merchantService: MerchantService,
  ) {}

  public async getProfile(sub: string): Promise<Record<string, any> | undefined> {
    const gameMicroserviceAddress = this.configService.get<string>(
      "GAME_MICROSERVICE_ADDRESS",
      "http://localhost:3011",
    );

    const merchantEntity = await this.merchantService.findOne({ id: 1 });
    if (!merchantEntity) {
      throw new NotFoundException("merchantNotFound");
    }

    return this.httpService
      .get<Record<string, any>>(`${gameMicroserviceAddress}/sync/${sub}/profile`, {
        headers: {
          Authorization: `Bearer ${merchantEntity.apiKey}`,
        },
      })
      .pipe(map(({ data }) => data))
      .toPromise();
  }

  public async getBalance(sub: string): Promise<Array<IBalance> | undefined> {
    const gameMicroserviceAddress = this.configService.get<string>(
      "GAME_MICROSERVICE_ADDRESS",
      "http://localhost:3011",
    );

    const merchantEntity = await this.merchantService.findOne({ id: 1 });
    if (!merchantEntity) {
      throw new NotFoundException("merchantNotFound");
    }

    return this.httpService
      .get<Array<IBalance>>(`${gameMicroserviceAddress}/sync/${sub}/balance`, {
        headers: {
          Authorization: `Bearer ${merchantEntity.apiKey}`,
        },
      })
      .pipe(map(({ data }) => data))
      .toPromise();
  }
}
