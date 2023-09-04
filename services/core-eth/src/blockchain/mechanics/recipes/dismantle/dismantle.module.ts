import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DismantleService } from "./dismantle.service";
import { DismantleEntity } from "./dismantle.entity";

@Module({
  imports: [TypeOrmModule.forFeature([DismantleEntity])],
  providers: [DismantleService],
  exports: [DismantleService],
})
export class DismantleModule {}
