import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { MerchantModule } from "../../infrastructure/merchant/merchant.module";
import { NotificatorService } from "./notificator.service";

@Module({
  imports: [ConfigModule, MerchantModule],
  providers: [Logger, NotificatorService],
  exports: [NotificatorService],
})
export class NotificatorModule {}
