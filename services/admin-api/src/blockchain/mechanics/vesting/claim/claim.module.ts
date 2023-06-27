import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractManagerModule } from "../../../contract-manager/contract-manager.module";
import { VestingClaimService } from "./claim.service";
import { VestingClaimController } from "./claim.controller";
import { ClaimEntity } from "../../claim/claim.entity";
import { AssetModule } from "../../../exchange/asset/asset.module";

@Module({
  imports: [ContractManagerModule, AssetModule, TypeOrmModule.forFeature([ClaimEntity])],
  providers: [Logger, VestingClaimService],
  controllers: [VestingClaimController],
  exports: [VestingClaimService],
})
export class VestingClaimModule {}
