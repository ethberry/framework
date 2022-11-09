import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientProxy } from "@nestjs/microservices";

import { RmqProviderType } from "@framework/types";
import { IEthLoggerInOutDto } from "./interfaces";

@Injectable()
export class EthLoggerService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(RmqProviderType.WATCHER_IN_SERVICE)
    private readonly loggerInProxy: ClientProxy,
    @Inject(RmqProviderType.WATCHER_OUT_SERVICE)
    private readonly loggerOutProxy: ClientProxy,
  ) {}

  public async addListener(dto: IEthLoggerInOutDto): Promise<any> {
    return this.loggerInProxy.emit(RmqProviderType.WATCHER_IN_SERVICE, dto).toPromise();
  }

  public async removeListener(dto: IEthLoggerInOutDto): Promise<any> {
    return this.loggerOutProxy.emit(RmqProviderType.WATCHER_OUT_SERVICE, dto).toPromise();
  }
}
