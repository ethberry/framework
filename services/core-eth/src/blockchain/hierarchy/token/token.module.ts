import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ethersRpcProvider, ethersSignerProvider } from "@gemunion/nestjs-ethers";

import { TokenEntity } from "./token.entity";
import { TokenService } from "./token.service";
import { TokenServiceEth } from "./token.service.eth";
import { ContractModule } from "../contract/contract.module";
import { ContractHistoryModule } from "../../contract-history/contract-history.module";

@Module({
  imports: [ConfigModule, ContractModule, ContractHistoryModule, TypeOrmModule.forFeature([TokenEntity])],
  providers: [Logger, ethersRpcProvider, ethersSignerProvider, TokenService, TokenServiceEth],
  exports: [TokenService, TokenServiceEth],
})
export class TokenModule {}
