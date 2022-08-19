import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc998CompositionService } from "./composition.service";
import { Erc998CompositionController } from "./composition.controller";
import { CompositionEntity } from "./composition.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CompositionEntity])],
  providers: [Erc998CompositionService],
  controllers: [Erc998CompositionController],
  exports: [Erc998CompositionService],
})
export class Erc998CompositionModule {}
