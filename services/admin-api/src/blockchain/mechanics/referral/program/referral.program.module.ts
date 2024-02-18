import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MerchantModule } from "../../../../infrastructure/merchant/merchant.module";
import { ReferralProgramController } from "./referral.program.controller";
import { ReferralProgramEntity } from "./referral.program.entity";
import { ReferralProgramService } from "./referral.program.service";
import { ReferralTreeController } from "./tree/referral.tree.controller";
import { ReferralTreeService } from "./tree/referral.tree.service";
import { ReferralTreeEntity } from "./tree/referral.tree.entity";

@Module({
  imports: [
    MerchantModule,
    TypeOrmModule.forFeature([ReferralProgramEntity]),
    TypeOrmModule.forFeature([ReferralTreeEntity]),
  ],
  controllers: [ReferralProgramController, ReferralTreeController],
  providers: [ReferralProgramService, ReferralTreeService],
  exports: [ReferralProgramService, ReferralTreeService],
})
export class ReferralProgramModule {}
