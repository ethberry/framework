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
    private readonly coreEthServiceBesuProxy: ClientProxy,
    @Inject(RmqProviderType.CORE_ETH_SERVICE_BINANCE)
    private readonly coreEthServiceBinanceProxy: ClientProxy,
  ) {}

  public async addListener(dto: IEthLoggerInOutDto): Promise<any> {
    return dto.chainId === 56 || dto.chainId === 97
      ? this.coreEthServiceBinanceProxy.emit(CoreEthType.ADD_LISTENER, dto).toPromise()
      : this.coreEthServiceBesuProxy.emit(CoreEthType.ADD_LISTENER, dto).toPromise();
  }

  public async removeListener(dto: IEthLoggerInOutDto): Promise<any> {
    return dto.chainId === 56 || dto.chainId === 97
      ? this.coreEthServiceBinanceProxy.emit(CoreEthType.REMOVE_LISTENER, dto).toPromise()
      : this.coreEthServiceBesuProxy.emit(CoreEthType.REMOVE_LISTENER, dto).toPromise();
  }
}
