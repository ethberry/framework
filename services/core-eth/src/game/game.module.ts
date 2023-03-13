import { Module } from "@nestjs/common";

import { NotificatorModule } from "./notificator/notificator.module";

@Module({
  imports: [NotificatorModule],
})
export class GameModule {}
