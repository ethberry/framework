import { Module } from "@nestjs/common";

import { AccessControlModule } from "./access-control/access-control.module";
import { AccessListModule } from "./access-list/access-list.module";

@Module({
  imports: [AccessControlModule, AccessListModule],
})
export class ExtensionsModule {}
