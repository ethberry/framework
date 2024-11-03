import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SignerModule } from "@framework/nest-js-module-exchange-signer";

import { SettingsModule } from "../../../../../infrastructure/settings/settings.module";
import { ContractModule } from "../../../../hierarchy/contract/contract.module";
import { ContractEntity } from "../../../../hierarchy/contract/contract.entity";
import { UserEntity } from "../../../../../infrastructure/user/user.entity";
import { MerchantEntity } from "../../../../../infrastructure/merchant/merchant.entity";
import { VestingBoxModule } from "../box/box.module";
import { VestingSignSeedService } from "./sign.seed.service";
import { TemplateEntity } from "../../../../hierarchy/template/template.entity";
import { VestingBoxEntity } from "../box/box.entity";
import { AssetEntity } from "../../../../exchange/asset/asset.entity";
import { AssetComponentEntity } from "../../../../exchange/asset/asset-component.entity";
import { SettingsEntity } from "../../../../../infrastructure/settings/settings.entity";

@Module({
  imports: [
    SettingsModule,
    SignerModule,
    ContractModule,
    VestingBoxModule,
    TypeOrmModule.forFeature([
      SettingsEntity,
      MerchantEntity,
      UserEntity,
      ContractEntity,
      TemplateEntity,
      AssetEntity,
      AssetComponentEntity,
      VestingBoxEntity,
    ]),
  ],
  providers: [VestingSignSeedService],
  exports: [VestingSignSeedService],
})
export class VestingSignSeedModule {}
