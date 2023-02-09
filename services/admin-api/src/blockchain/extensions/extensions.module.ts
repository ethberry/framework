import { Module } from "@nestjs/common";

import { AccessControlModule } from "./access-control/access-control.module";
import { AccessListModule } from "./access-list/access-list.module";
import { ContractHistoryModule } from "../hierarchy/contract/history/history.module";

@Module({
  imports: [ContractHistoryModule, AccessControlModule, AccessListModule],
})
export class ExtensionsModule {}
