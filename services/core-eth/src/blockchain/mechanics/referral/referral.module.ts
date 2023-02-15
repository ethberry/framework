import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ReferralControllerEth } from "./referral.controller.eth";
import { ReferralServiceEth } from "./referral.service.eth";
import { ReferralService } from "./referral.service";
import { ReferralEntity } from "./referral.entity";
import { ContractModule } from "../../hierarchy/contract/contract.module";
import { EventHistoryModule } from "../../event-history/event-history.module";

@Module({
  imports: [TypeOrmModule.forFeature([ReferralEntity]), EventHistoryModule, ContractModule, ConfigModule],
  providers: [Logger, ReferralService, ReferralServiceEth],
  controllers: [ReferralControllerEth],
  exports: [ReferralService, ReferralServiceEth],
})
export class ReferralModule {}
