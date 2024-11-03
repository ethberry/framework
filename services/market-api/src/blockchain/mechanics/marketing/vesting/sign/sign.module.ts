import { Logger, Module } from "@nestjs/common";

import { SignerModule } from "@framework/nest-js-module-exchange-signer";

import { SettingsModule } from "../../../../../infrastructure/settings/settings.module";
import { ContractModule } from "../../../../hierarchy/contract/contract.module";
import { VestingBoxModule } from "../box/box.module";
import { VestingSignService } from "./sign.service";
import { VestingSignController } from "./sign.controller";

@Module({
  imports: [SettingsModule, SignerModule, ContractModule, VestingBoxModule],
  providers: [Logger, VestingSignService],
  controllers: [VestingSignController],
  exports: [VestingSignService],
})
export class VestingSignModule {}
