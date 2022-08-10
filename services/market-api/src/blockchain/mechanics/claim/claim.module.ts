import { Module } from "@nestjs/common";

import { TypeOrmModule } from "@nestjs/typeorm";

import { ClaimService } from "./claim.service";
import { ClaimEntity } from "./claim.entity";
import { ClaimController } from "./claim.controller";

@Module({
  imports: [TypeOrmModule.forFeature([ClaimEntity])],
  providers: [ClaimService],
  controllers: [ClaimController],
  exports: [ClaimService],
})
export class ClaimModule {}
