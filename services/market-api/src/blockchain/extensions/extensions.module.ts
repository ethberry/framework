import { Module } from "@nestjs/common";

import { AccessControlModule } from "./access-control/access-control.module";

@Module({
  imports: [AccessControlModule],
})
export class ExtensionsModule {}
