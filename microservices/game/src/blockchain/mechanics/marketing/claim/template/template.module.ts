import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SecretManagerModule } from "@ethberry/nest-js-module-secret-manager-gcp";

import { SignerModule } from "@framework/nest-js-module-exchange-signer";

import { MerchantModule } from "../../../../../infrastructure/merchant/merchant.module";
import { ContractModule } from "../../../../hierarchy/contract/contract.module";
import { AssetModule } from "../../../../exchange/asset/asset.module";
import { ClaimEntity } from "../claim.entity";
import { ClaimTemplateService } from "./template.service";
import { ClaimTemplateController } from "./template.controller";
import { ClaimServiceRmq } from "./template.service.rmq";

@Module({
  imports: [
    SignerModule,
    ContractModule,
    AssetModule,
    MerchantModule,
    SecretManagerModule.deferred(),
    TypeOrmModule.forFeature([ClaimEntity]),
  ],
  providers: [ClaimTemplateService, ClaimServiceRmq],
  controllers: [ClaimTemplateController],
  exports: [ClaimTemplateService, ClaimServiceRmq],
})
export class ClaimTemplateModule {}
