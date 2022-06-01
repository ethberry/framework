import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AccessControlService } from "./access-control.service";
import { AccessControlEntity } from "./access-control.entity";
import { AccessControlHistoryModule } from "./access-control-history/access-control-history.module";
import { AccessControlServiceEth } from "./access-control.service.eth";

@Module({
  imports: [AccessControlHistoryModule, TypeOrmModule.forFeature([AccessControlEntity])],
  providers: [Logger, AccessControlService, AccessControlServiceEth],
  exports: [AccessControlService, AccessControlServiceEth],
})
export class AccessControlModule {}
