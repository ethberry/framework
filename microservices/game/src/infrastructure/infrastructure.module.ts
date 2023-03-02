import { Module } from "@nestjs/common";

import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { SyncModule } from "./sync/sync.module";

@Module({
  imports: [AuthModule, UserModule, SyncModule],
})
export class InfrastructureModule {}
