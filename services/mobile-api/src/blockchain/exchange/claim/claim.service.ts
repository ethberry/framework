import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";

import type { IClaim } from "@framework/types";

export interface IRmqClaim {
  transactionHash: string;
  claim: IClaim;
}

@Injectable()
export class ClaimService {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
  ) {}

  public async claim(dto: IRmqClaim): Promise<void> {
    await Promise.resolve();
    this.loggerService.log(JSON.stringify(dto, null, "\t"), ClaimService.name);
  }
}
