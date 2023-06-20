import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { IAssetComponentHistory } from "@framework/types";

export interface IRmqPurchase {
  transactionHash: string;
  account: string;
  items: Array<IAssetComponentHistory>;
  price: Array<IAssetComponentHistory>;
}

@Injectable()
export class CoreService {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
  ) {}

  public async purchase(dto: IRmqPurchase): Promise<void> {
    await Promise.resolve();
    this.loggerService.log(JSON.stringify(dto, null, "\t"), CoreService.name);
  }
}
