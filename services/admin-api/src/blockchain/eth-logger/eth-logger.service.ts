import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

import { CoreEthType, RmqProviderType } from "@framework/types";

import type { IEthLoggerInOutDto } from "./interfaces";

@Injectable()
export class EthLoggerService {
  constructor(
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
    @Inject(RmqProviderType.CORE_ETH_SERVICE)
    private readonly coreEthServiceProxy: ClientProxy,
  ) {}

  public async addListener(dto: IEthLoggerInOutDto): Promise<any> {
    return this.coreEthServiceProxy.emit(CoreEthType.ADD_LISTENER, dto).toPromise();
  }

  public async removeListener(dto: IEthLoggerInOutDto): Promise<any> {
    return this.coreEthServiceProxy.emit(CoreEthType.REMOVE_LISTENER, dto).toPromise();
  }
}
