import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MerchantEntity } from "../../../infrastructure/merchant/merchant.entity";
import { UserEntity } from "../../../infrastructure/user/user.entity";
import { AssetEntity } from "../../exchange/asset/asset.entity";
import { AssetComponentEntity } from "../../exchange/asset/asset-component.entity";
import { ContractEntity } from "../../hierarchy/contract/contract.entity";
import { TemplateEntity } from "../../hierarchy/template/template.entity";
import { ClaimSeedService } from "./claim.seed.service";
import { ClaimEntity } from "./claim.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClaimEntity,
      MerchantEntity,
      UserEntity,
      AssetEntity,
      AssetComponentEntity,
      ContractEntity,
      TemplateEntity,
    ]),
  ],
  providers: [ClaimSeedService],
  exports: [ClaimSeedService],
})
export class ClaimSeedModule {}
