import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractManagerModule } from "../../../contract-manager/contract-manager.module";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { AssetModule } from "../../../exchange/asset/asset.module";
import { ClaimEntity } from "../../claim/claim.entity";
import { VestingClaimController } from "./claim.controller";
import { VestingClaimService } from "./claim.service";

@Module({
  imports: [ContractManagerModule, AssetModule, ContractModule, TypeOrmModule.forFeature([ClaimEntity])],
  providers: [Logger, VestingClaimService],
  controllers: [VestingClaimController],
  exports: [VestingClaimService],
})
export class VestingClaimModule {}
