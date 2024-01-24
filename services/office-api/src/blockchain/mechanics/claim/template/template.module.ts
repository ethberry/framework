import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SignerModule } from "@framework/nest-js-module-exchange-signer";

import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { AssetModule } from "../../../exchange/asset/asset.module";
import { ClaimEntity } from "../claim.entity";
import { ClaimTemplateService } from "./template.service";
import { ClaimTemplateController } from "./template.controller";

@Module({
  imports: [SignerModule, AssetModule, ContractModule, TypeOrmModule.forFeature([ClaimEntity])],
  providers: [Logger, ClaimTemplateService],
  controllers: [ClaimTemplateController],
  exports: [ClaimTemplateService],
})
export class ClaimTemplateModule {}
