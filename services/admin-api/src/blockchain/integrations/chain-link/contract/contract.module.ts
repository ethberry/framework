import { Module } from "@nestjs/common";

import { ChainLinkContractService } from "./contract.service";
import { ChainLinkContractController } from "./contract.controller";
import { ContractModule } from "../../../hierarchy/contract/contract.module";

@Module({
  imports: [ContractModule],
  providers: [ChainLinkContractService],
  controllers: [ChainLinkContractController],
  exports: [ChainLinkContractService],
})
export class ChainLinkContractModule {}
