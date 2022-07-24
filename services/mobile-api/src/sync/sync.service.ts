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
    const jsonMicroserviceAddress = this.configService.get<string>(
      "GAME_MICROSERVICE_ADDRESS",
      "http://localhost:3011",
    );

    const gameApiKey = this.configService.get<string>("GAME_MICROSERVICE_API_KEY", "");

    return this.httpService
      .get<Record<string, any>>(`${jsonMicroserviceAddress}/sync/${sub}/profile`, {
        headers: {
          Authorization: `Bearer ${gameApiKey}`,
        },
      })
      .pipe(map(({ data }) => data))
      .toPromise();
  }

  public async getBalance(sub: string): Promise<Array<IBalance> | undefined> {
    const jsonMicroserviceAddress = this.configService.get<string>(
      "GAME_MICROSERVICE_ADDRESS",
      "http://localhost:3011",
    );

    const gameApiKey = this.configService.get<string>("GAME_MICROSERVICE_API_KEY", "");

    return this.httpService
      .get<Array<IBalance>>(`${jsonMicroserviceAddress}/sync/${sub}/balance`, {
        headers: {
          Authorization: `Bearer ${gameApiKey}`,
        },
      })
      .pipe(map(({ data }) => data))
      .toPromise();
  }
}
