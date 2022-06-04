import { Logger, Module } from "@nestjs/common";

import { WebhookService } from "./webhook.service";
import { WebhookController } from "./webhook.controller";

@Module({
  providers: [Logger, WebhookService],
  controllers: [WebhookController],
  exports: [WebhookService],
})
export class WebhookModule {}
