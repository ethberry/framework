import { Module } from "@nestjs/common";

import { MysteryBoxModule } from "./box/box.module";
import { MysteryContractModule } from "./contract/contract.module";

@Module({
  imports: [MysteryContractModule, MysteryBoxModule],
})
export class MysteryModule {}
