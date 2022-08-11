import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractManagerModule } from "../../contract-manager/contract-manager.module";

import { ReferralHistoryModule } from "./history/ref-history.module";
import { ReferralControllerEth } from "./referral.controller.eth";
import { ReferralServiceEth } from "./referral.service.eth";
import { ReferralService } from "./referral.service";
import { ReferralEntity } from "./referral.entity";

@Module({
  imports: [ContractManagerModule, TypeOrmModule.forFeature([ReferralEntity]), ReferralHistoryModule],
  providers: [Logger, ReferralService, ReferralServiceEth],
  controllers: [ReferralControllerEth],
  exports: [ReferralService, ReferralServiceEth],
})
export class ReferralModule {}
