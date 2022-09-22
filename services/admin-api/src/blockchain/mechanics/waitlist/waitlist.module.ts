import { Module } from "@nestjs/common";

import { WaitlistItemModule } from "./item/item.module";
import { WaitlistListModule } from "./list/list.module";

@Module({
  imports: [WaitlistListModule, WaitlistItemModule],
})
export class WaitlistModule {}
