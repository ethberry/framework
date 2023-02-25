import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SignerModule } from "@gemunion/nest-js-module-exchange-signer";

import { ClaimEntity } from "./claim.entity";
import { ClaimService } from "./claim.service";
import { ClaimController } from "./claim.controller";
import { AssetModule } from "../../exchange/asset/asset.module";

@Module({
  imports: [SignerModule, AssetModule, TypeOrmModule.forFeature([ClaimEntity])],
  providers: [Logger, ClaimService],
  controllers: [ClaimController],
  exports: [ClaimService],
})
export class ClaimModule {}
