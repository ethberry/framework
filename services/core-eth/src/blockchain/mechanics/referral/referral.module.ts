import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ReferralHistoryModule } from "./history/history.module";
import { ReferralControllerEth } from "./referral.controller.eth";
import { ReferralServiceEth } from "./referral.service.eth";
import { ReferralService } from "./referral.service";
import { ReferralEntity } from "./referral.entity";
import { ContractModule } from "../../hierarchy/contract/contract.module";

@Module({
  imports: [TypeOrmModule.forFeature([ReferralEntity]), ReferralHistoryModule, ContractModule, ConfigModule],
  providers: [Logger, ReferralService, ReferralServiceEth],
  controllers: [ReferralControllerEth],
  exports: [ReferralService, ReferralServiceEth],
})
export class ReferralModule {}
