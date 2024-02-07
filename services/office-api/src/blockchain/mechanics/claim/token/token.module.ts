import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SignerModule } from "@framework/nest-js-module-exchange-signer";

import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { AssetModule } from "../../../exchange/asset/asset.module";
import { ClaimEntity } from "../claim.entity";
import { ClaimTokenService } from "./token.service";
import { ClaimTokenController } from "./token.controller";

@Module({
  imports: [SignerModule, AssetModule, ContractModule, TypeOrmModule.forFeature([ClaimEntity])],
  providers: [Logger, ClaimTokenService],
  controllers: [ClaimTokenController],
  exports: [ClaimTokenService],
})
export class ClaimTokenModule {}
