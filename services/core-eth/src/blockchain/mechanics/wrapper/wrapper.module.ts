import { Module, Logger } from "@nestjs/common";

import { WrapperServiceEth } from "./wrapper.service.eth";
import { WrapperControllerEth } from "./wrapper.controller.eth";
import { WrapperLogModule } from "./log/log.module";
import { ContractModule } from "../../hierarchy/contract/contract.module";
import { TokenModule } from "../../hierarchy/token/token.module";
import { ContractHistoryModule } from "../../contract-history/contract-history.module";
import { Erc721TokenModule } from "../../tokens/erc721/token/token.module";

@Module({
  imports: [ContractModule, TokenModule, Erc721TokenModule, ContractHistoryModule, WrapperLogModule],
  providers: [Logger, WrapperServiceEth],
  controllers: [WrapperControllerEth],
  exports: [WrapperServiceEth],
})
export class WrapperModule {}
