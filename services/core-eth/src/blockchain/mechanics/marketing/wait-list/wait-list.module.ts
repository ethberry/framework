import { Module } from "@nestjs/common";

import { WaitListItemModule } from "./item/item.module";
import { WaitListListModule } from "./list/list.module";

@Module({
  imports: [WaitListItemModule, WaitListListModule],
})
export class WaitListModule {}
