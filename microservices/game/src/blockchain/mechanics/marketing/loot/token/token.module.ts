import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { LootTokenService } from "./token.service";
import { LootTokenController } from "./token.controller";
import { TokenEntity } from "../../../../hierarchy/token/token.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TokenEntity])],
  providers: [LootTokenService],
  controllers: [LootTokenController],
  exports: [LootTokenService],
})
export class LootTokenModule {}
