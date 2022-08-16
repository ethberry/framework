import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { ethersRpcProvider, ethersSignerProvider } from "@gemunion/nestjs-ethers";

import { ChainLinkServiceCron } from "./chain-link.service.cron";
import { ContractModule } from "../../hierarchy/contract/contract.module";
import { emlServiceProvider } from "../../../common/providers";

@Module({
  imports: [ConfigModule, ContractModule],
  providers: [emlServiceProvider, ethersRpcProvider, ethersSignerProvider, ChainLinkServiceCron],
})
export class ChainLinkModule {}
