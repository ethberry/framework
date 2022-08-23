import { Module } from "@nestjs/common";

import { ChainLinkService } from "./chain-link.service";
import { ChainLinkController } from "./chain-link.controller";
import { ContractModule } from "../../hierarchy/contract/contract.module";

@Module({
  imports: [ContractModule],
  providers: [ChainLinkService],
  controllers: [ChainLinkController],
  exports: [ChainLinkService],
})
export class ChainLinkModule {}
