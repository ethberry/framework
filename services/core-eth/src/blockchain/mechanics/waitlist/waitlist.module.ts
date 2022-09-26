import { Module } from "@nestjs/common";

import { WaitlistLogModule } from "./log/log.module";
import { WaitlistItemModule } from "./item/item.module";

@Module({
  imports: [WaitlistLogModule, WaitlistItemModule],
})
export class WaitlistModule {}
