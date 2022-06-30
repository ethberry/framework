import { Module } from "@nestjs/common";

import { UniModule } from "./uni-token/uni.module";

@Module({
  imports: [UniModule],
})
export class BlockchainModule {}
