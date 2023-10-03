import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";

import type { IMessage } from "@framework/types";

@Injectable()
export class NotificatorService {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
  ) {}

  public dummy(data: IMessage): void {
    this.loggerService.log(JSON.stringify(data, null, "\t"), NotificatorService.name);
  }
}
