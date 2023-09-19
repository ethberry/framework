import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SignerModule } from "@framework/nest-js-module-exchange-signer";

import { ClaimEntity } from "./claim.entity";
import { ClaimService } from "./claim.service";
import { ClaimController } from "./claim.controller";
import { AssetModule } from "../../exchange/asset/asset.module";
import { ContractModule } from "../../hierarchy/contract/contract.module";

@Module({
  imports: [SignerModule, AssetModule, ContractModule, TypeOrmModule.forFeature([ClaimEntity])],
  providers: [Logger, ClaimService],
  controllers: [ClaimController],
  exports: [ClaimService],
})
export class ClaimModule {}
