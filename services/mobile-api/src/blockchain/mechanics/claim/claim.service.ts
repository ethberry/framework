import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";

import type { IClaim } from "@framework/types";

@Injectable()
export class ClaimService {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
  ) {}

  public async claim(dto: IClaim): Promise<void> {
    await Promise.resolve();
    this.loggerService.log(dto, ClaimService.name);
  }
}
