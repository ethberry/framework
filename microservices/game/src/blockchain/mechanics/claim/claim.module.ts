import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SignerModule } from "@framework/nest-js-module-exchange-signer";

import { MerchantModule } from "../../../infrastructure/merchant/merchant.module";
import { AssetModule } from "../../exchange/asset/asset.module";
import { ClaimService } from "./claim.service";
import { ClaimEntity } from "./claim.entity";
import { ClaimController } from "./claim.controller";
import { ClaimServiceRmq } from "./claim.service.rmq";

@Module({
  imports: [SignerModule, AssetModule, MerchantModule, TypeOrmModule.forFeature([ClaimEntity])],
  providers: [Logger, ClaimService, ClaimServiceRmq],
  controllers: [ClaimController],
  exports: [ClaimService, ClaimServiceRmq],
})
export class ClaimModule {}
