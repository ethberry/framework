import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MysteryBoxEntity } from "./box.entity";
import { MysteryBoxSeedService } from "./box.seed.service";
import { MerchantEntity } from "../../../../../infrastructure/merchant/merchant.entity";
import { UserEntity } from "../../../../../infrastructure/user/user.entity";
import { AssetEntity } from "../../../../exchange/asset/asset.entity";
import { AssetComponentEntity } from "../../../../exchange/asset/asset-component.entity";
import { ContractEntity } from "../../../../hierarchy/contract/contract.entity";
import { TemplateEntity } from "../../../../hierarchy/template/template.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MerchantEntity,
      UserEntity,
      AssetEntity,
      AssetComponentEntity,
      ContractEntity,
      TemplateEntity,
      MysteryBoxEntity,
    ]),
  ],
  providers: [MysteryBoxSeedService],
  exports: [MysteryBoxSeedService],
})
export class MysteryBoxSeedModule {}
