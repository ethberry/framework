import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ReferralProgramEntity } from "./referral.program.entity";
import { ReferralTreeEntity } from "./tree/referral.tree.entity";
import { ReferralProgramService } from "./referral.program.service";
import { ReferralTreeService } from "./tree/referral.tree.service";
import { ContractModule } from "../../../hierarchy/contract/contract.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([ReferralProgramEntity]),
    TypeOrmModule.forFeature([ReferralTreeEntity]),
    ConfigModule,
    ContractModule,
  ],
  providers: [ReferralProgramService, ReferralTreeService],
  exports: [ReferralProgramService, ReferralTreeService],
})
export class ReferralProgramModule {}
