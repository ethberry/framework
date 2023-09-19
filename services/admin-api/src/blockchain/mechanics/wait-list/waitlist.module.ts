import { Module } from "@nestjs/common";

import { WaitListItemModule } from "./item/item.module";
import { WaitListListModule } from "./list/list.module";
import { WaitListContractModule } from "./contract/waitlist.module";

@Module({
  imports: [WaitListContractModule, WaitListListModule, WaitListItemModule],
})
export class WaitListModule {}
