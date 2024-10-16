import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SecretManagerModule } from "@ethberry/nest-js-module-secret-manager-gcp";

import { SignerModule } from "@framework/nest-js-module-exchange-signer";

import { MerchantModule } from "../../../../../infrastructure/merchant/merchant.module";
import { ContractModule } from "../../../../hierarchy/contract/contract.module";
import { AssetModule } from "../../../../exchange/asset/asset.module";
import { ClaimTokenService } from "./token.service";
import { ClaimEntity } from "../claim.entity";
import { ClaimTokenController } from "./token.controller";

@Module({
  imports: [
    SignerModule,
    ContractModule,
    AssetModule,
    MerchantModule,
    SecretManagerModule.deferred(),
    TypeOrmModule.forFeature([ClaimEntity]),
  ],
  providers: [ClaimTokenService],
  controllers: [ClaimTokenController],
  exports: [ClaimTokenService],
})
export class ClaimTokenModule {}
