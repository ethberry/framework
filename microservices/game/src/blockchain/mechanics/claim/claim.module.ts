import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SignerModule } from "@gemunion/nest-js-module-exchange-signer";

import { ClaimService } from "./claim.service";
import { ClaimEntity } from "./claim.entity";
import { AssetModule } from "../asset/asset.module";
import { ClaimController } from "./claim.controller";

@Module({
  imports: [SignerModule, AssetModule, TypeOrmModule.forFeature([ClaimEntity])],
  providers: [Logger, ClaimService],
  controllers: [ClaimController],
  exports: [ClaimService],
})
export class ClaimModule {}
