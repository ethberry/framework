import { Logger, Module } from "@nestjs/common";

import { SignerModule } from "@framework/nest-js-module-exchange-signer";

import { SettingsModule } from "../../../../../infrastructure/settings/settings.module";
import { ContractModule } from "../../../../hierarchy/contract/contract.module";
import { LootSignService } from "./sign.service";
import { LootSignController } from "./sign.controller";
import { LootBoxModule } from "../box/box.module";

@Module({
  imports: [SettingsModule, SignerModule, ContractModule, LootBoxModule],
  providers: [Logger, LootSignService],
  controllers: [LootSignController],
  exports: [LootSignService],
})
export class LootSignModule {}
