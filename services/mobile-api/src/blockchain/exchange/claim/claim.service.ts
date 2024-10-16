import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";

import type { IRmqClaimTemplate, IRmqClaimToken } from "./interface";

@Injectable()
export class ClaimService {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
  ) {}

  public async rewardSet(dto: IRmqClaimTemplate): Promise<void> {
    await Promise.resolve();
    this.loggerService.log(JSON.stringify(dto, null, "\t"), ClaimService.name);
  }

  public async rewardClaimed(dto: IRmqClaimToken): Promise<void> {
    await Promise.resolve();
    this.loggerService.log(JSON.stringify(dto, null, "\t"), ClaimService.name);
  }
}
