import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc998CompositionService } from "./composition.service";
import { CompositionEntity } from "./composition.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CompositionEntity])],
  providers: [Erc998CompositionService],
  exports: [Erc998CompositionService],
})
export class Erc998CompositionModule {}
