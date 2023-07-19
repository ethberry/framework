import { Module } from "@nestjs/common";

import { WaitListModule } from "./wait-list/waitlist.module";

@Module({
  imports: [WaitListModule],
})
export class MechanicsModule {}
