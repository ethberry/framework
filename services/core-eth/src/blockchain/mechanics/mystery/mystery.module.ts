import { Module } from "@nestjs/common";

import { MysteryBoxModule } from "./box/box.module";

@Module({
  imports: [MysteryBoxModule],
})
export class MysteryModule {}
