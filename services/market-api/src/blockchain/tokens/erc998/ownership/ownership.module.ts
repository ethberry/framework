import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { OwnershipService } from "./ownership.service";
import { OwnershipEntity } from "./ownership.entity";

@Module({
  imports: [TypeOrmModule.forFeature([OwnershipEntity])],
  providers: [OwnershipService],
  exports: [OwnershipService],
})
export class OwnershipModule {}
