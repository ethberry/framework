import { Logger, Module } from "@nestjs/common";

import { ClaimService } from "./claim.service";
import { ClaimControllerRmq } from "./claim.controller.rmq";

@Module({
  imports: [],
  providers: [Logger, ClaimService],
  controllers: [ClaimControllerRmq],
  exports: [ClaimService],
})
export class ClaimModule {}
