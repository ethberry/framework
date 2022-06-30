import { Module } from "@nestjs/common";

import { UniContractModule } from "./uni-contract/uni-contract.module";

@Module({
  imports: [UniContractModule],
})
export class UniModule {}
