import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { ethersRpcProvider, ethersSignerProvider } from "@gemunion/nestjs-ethers";

import { LootService } from "./loot.service";
import { TemplateModule } from "../../blockchain/hierarchy/template/template.module";
import { SignerModule } from "../signer/signer.module";

@Module({
  imports: [ConfigModule, SignerModule, TemplateModule],
  providers: [ethersRpcProvider, ethersSignerProvider, Logger, LootService],
  exports: [LootService],
})
export class LootModule {}
