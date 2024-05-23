import { Module } from "@nestjs/common";

import { LootBoxModule } from "./box/box.module";
import { LootContractModule } from "./contract/contract.module";
import { LootTokenModule } from "./token/token.module";

@Module({
  imports: [LootContractModule, LootBoxModule, LootTokenModule],
})
export class LootModule {}
