import { Module } from "@nestjs/common";

import { WaitListItemModule } from "./item/item.module";
import { WaitListListModule } from "./list/list.module";
import { WaitListLogModule } from "./log/log.module";

@Module({
  imports: [WaitListItemModule, WaitListListModule, WaitListLogModule],
})
export class WaitListModule {}
