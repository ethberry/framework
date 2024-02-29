import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CraftService } from "./craft.service";
import { CraftEntity } from "./craft.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CraftEntity])],
  providers: [CraftService],
  exports: [CraftService],
})
export class CraftModule {}
