import { Module } from "@nestjs/common";

import { LootBoxModule } from "./box/box.module";

@Module({
  imports: [LootBoxModule],
})
export class LootModule {}
