import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { map } from "rxjs";

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
      "JSON_MICROSERVICE_ADDRESS",
      "http://localhost:3011",
    );

    const jsonApiKey = this.configService.get<string>("JSON_MICROSERVICE_API_KEY", "");

    return this.httpService
      .get<Record<string, any>>(`${jsonMicroserviceAddress}/sync/${sub}/profile`, {
        headers: {
          Authorization: `Bearer ${jsonApiKey}`,
        },
      })
      .pipe(map(({ data }) => data))
      .toPromise();
  }
}
