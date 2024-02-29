import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ClaimEntity } from "./claim.entity";
import { ClaimService } from "./claim.service";

@Module({
  imports: [TypeOrmModule.forFeature([ClaimEntity])],
  providers: [Logger, ClaimService],
  exports: [ClaimService],
})
export class ClaimModule {}
