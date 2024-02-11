import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MerchantModule } from "../../../../infrastructure/merchant/merchant.module";
import { ReferralProgramController } from "./referral.program.controller";
import { ReferralProgramEntity } from "./referral.program.entity";
import { ReferralProgramService } from "./referral.program.service";

@Module({
  imports: [MerchantModule, TypeOrmModule.forFeature([ReferralProgramEntity])],
  controllers: [ReferralProgramController],
  providers: [ReferralProgramService],
  exports: [ReferralProgramService],
})
export class ReferralProgramModule {}
