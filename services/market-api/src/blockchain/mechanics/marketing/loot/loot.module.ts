import { Module } from "@nestjs/common";

import { LootContractModule } from "./contract/contract.module";
import { LootTokenModule } from "./token/token.module";
import { LootBoxModule } from "./box/box.module";
import { LootSignModule } from "./sign/sign.module";

@Module({
  imports: [LootContractModule, LootBoxModule, LootTokenModule, LootSignModule],
})
export class LootModule {}
