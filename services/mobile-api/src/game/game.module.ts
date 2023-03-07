import { Module } from "@nestjs/common";

import { EventModule } from "./events/event.module";
import { NotificatorModule } from "./notificator/notificator.module";
import { WebhookModule } from "./webhook/webhook.module";

@Module({
  imports: [EventModule, NotificatorModule, WebhookModule],
})
export class GameModule {}
