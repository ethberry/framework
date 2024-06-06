import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TokenEntity } from "../../../../hierarchy/token/token.entity";
import { MysteryTokenService } from "./token.service";
import { MysteryTokenController } from "./token.controller";

@Module({
  imports: [TypeOrmModule.forFeature([TokenEntity])],
  providers: [MysteryTokenService],
  controllers: [MysteryTokenController],
  exports: [MysteryTokenService],
})
export class MysteryTokenModule {}
