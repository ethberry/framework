import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AccessControlService } from "./access-control.service";
import { AccessControlEntity } from "./access-control.entity";

@Module({
  imports: [TypeOrmModule.forFeature([AccessControlEntity])],
  providers: [AccessControlService],
  exports: [AccessControlService],
})
export class AccessControlModule {}
