import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { VestingBoxController } from "./box.controller";
import { VestingBoxEntity } from "./box.entity";
import { VestingBoxService } from "./box.service";

@Module({
  imports: [TypeOrmModule.forFeature([VestingBoxEntity])],
  providers: [VestingBoxService],
  controllers: [VestingBoxController],
  exports: [VestingBoxService],
})
export class VestingBoxModule {}
