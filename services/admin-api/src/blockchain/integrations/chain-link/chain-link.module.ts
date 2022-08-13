import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { ChainLinkService } from "./chain-link.service";
import { ChainLinkController } from "./chain-link.controller";
import { ContractModule } from "../../hierarchy/contract/contract.module";

@Module({
  imports: [ContractModule, ConfigModule],
  providers: [ChainLinkService],
  controllers: [ChainLinkController],
  exports: [ChainLinkService],
})
export class ChainLinkModule {}
