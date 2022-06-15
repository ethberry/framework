import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { map } from "rxjs";

@Injectable()
export class JsonService {
  constructor(
    private httpService: HttpService,
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
  ) {}

  public async getBalance(sub: string): Promise<Record<string, any> | undefined> {
    const jsonMicroserviceAddress = this.configService.get<string>(
      "JSON_MICROSERVICE_ADDRESS",
      "http://localhost:3002",
    );

    const gameServiceApiKey = this.configService.get<string>("GAME_SERVER_API_KEY", "");

    return this.httpService
      .get<Record<string, any>>(`${jsonMicroserviceAddress}/game/${sub}/profile`, {
        headers: {
          Authorization: `Bearer ${gameServiceApiKey}`,
        },
      })
      .pipe(map(({ data }) => data))
      .toPromise();
  }
}
