import { Module } from "@nestjs/common";

import { MysteryboxBoxModule } from "./box/box.module";

@Module({
  imports: [MysteryboxBoxModule],
})
export class MysteryboxModule {}
