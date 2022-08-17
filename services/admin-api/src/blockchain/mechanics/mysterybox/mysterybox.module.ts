import { Module } from "@nestjs/common";

import { MysteryboxBoxModule } from "./box/mysterybox.module";
import { MysteryboxContractModule } from "./contract/contract.module";

@Module({
  imports: [MysteryboxContractModule, MysteryboxBoxModule],
})
export class MysteryboxModule {}
