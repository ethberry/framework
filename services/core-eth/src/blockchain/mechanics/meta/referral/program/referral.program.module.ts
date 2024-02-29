import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ReferralProgramService } from "./referral.program.service";
import { ReferralProgramEntity } from "./referral.program.entity";
import { ReferralTreeService } from "./tree/referral.tree.service";
import { ReferralTreeEntity } from "./tree/referral.tree.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ReferralProgramEntity]), TypeOrmModule.forFeature([ReferralTreeEntity])],
  providers: [ReferralProgramService, ReferralTreeService],
  exports: [ReferralProgramService, ReferralTreeService],
})
export class ReferralProgramModule {}
