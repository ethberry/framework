import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TokenEntity } from "../../../../hierarchy/token/token.entity";
import { LootTokenService } from "./token.service";
import { LootTokenController } from "./token.controller";

@Module({
  imports: [TypeOrmModule.forFeature([TokenEntity])],
  providers: [LootTokenService],
  controllers: [LootTokenController],
  exports: [LootTokenService],
})
export class LootTokenModule {}
