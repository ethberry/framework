import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";

@Injectable()
export class WebhookService {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
  ) {}

  public dummy(dto: any): void {
    this.loggerService.log(dto, WebhookService.name);
  }
}
