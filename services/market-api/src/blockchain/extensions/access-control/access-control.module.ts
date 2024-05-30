import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { BalanceEntity } from "../../hierarchy/balance/balance.entity";
import { AccessControlService } from "./access-control.service";
import { AccessControlEntity } from "./access-control.entity";
import { AccessControlController } from "./access-control.controller";

@Module({
  imports: [TypeOrmModule.forFeature([AccessControlEntity, BalanceEntity])],
  providers: [AccessControlService],
  controllers: [AccessControlController],
  exports: [AccessControlService],
})
export class AccessControlModule {}
