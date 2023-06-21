import { Module } from "@nestjs/common";

import { WaitListModule } from "./waitlist/waitlist.module";

@Module({
  imports: [WaitListModule],
})
export class MechanicsModule {}
