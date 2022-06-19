import { Logger, Module } from "@nestjs/common";
import { NotificatorController } from "./notificator.controller";
import { NotificatorService } from "./notificator.service";

@Module({
  providers: [Logger, NotificatorService],
  controllers: [NotificatorController],
  exports: [NotificatorService],
})
export class NotificatorModule {}
