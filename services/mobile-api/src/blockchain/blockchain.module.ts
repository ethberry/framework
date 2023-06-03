import { Module } from "@nestjs/common";

import { MechanicsModule } from "./mechanics/mechanics.module";

@Module({
  imports: [MechanicsModule],
})
export class BlockchainModule {}
