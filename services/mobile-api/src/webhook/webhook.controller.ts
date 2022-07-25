import { Body, Controller, HttpCode, Post } from "@nestjs/common";

import { WebhookService } from "./webhook.service";

@Controller("/webhook")
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post("/")
  @HttpCode(200)
  public search(@Body() dto: any): void {
    return this.webhookService.dummy(dto);
  }
}
